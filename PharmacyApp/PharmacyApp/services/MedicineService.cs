using System.Reflection.PortableExecutable;
using PharmacyApp.Models;

namespace PharmacyApp.services
{
    public class MedicineService : IMedicineService
    {
        private readonly IDataStore _dataStore;
        private readonly ILogger<MedicineService> _logger;
        private const string MEDICINES_FILE = "medicines.json";
        private const string SALES_FILE = "sales.json";
        public MedicineService(IDataStore dataStore, ILogger<MedicineService> logger)
        {
            _dataStore = dataStore;
            _logger = logger;
        }
        public async Task<Medicine> AddAsync(Medicine medicine)
        {
            if (string.IsNullOrWhiteSpace(medicine.FullName))
            {
                throw new ArgumentNullException("Medicine name is required");
            }
            if (medicine.Price <= 0)
            {
                throw new ArgumentException("Price is required");
            }
            if(medicine.Quantity == 0)
            {
                throw new ArgumentException("Quantity is required");
            }
            medicine.Id = Guid.NewGuid();
            medicine.CreatedAt = DateTime.UtcNow;
            var medicines = await GetAllAsync();
            medicines.Add(medicine);
            await _dataStore.WriteAsync(MEDICINES_FILE, medicines);
            _logger.LogInformation("Added medicine: {MedicineName} (ID: {MedicineId})",medicine.FullName, medicine.Id);
            return medicine;
        }

        public async  Task<bool> DeleteAsync(Guid id)
        {
            var medicines = await GetAllAsync();
            var medicine = medicines.FirstOrDefault(x => x.Id == id);
            if (medicine == null)
            {
                return false;
            }
            medicines.Remove(medicine);
            await _dataStore.WriteAsync(MEDICINES_FILE, medicines);
            _logger.LogInformation("Deleted Medicine : {MedicineName} (ID :{MedicineId})", medicine.FullName, medicine.Id);
            return true;
        }

        public async Task<List<Medicine>> GetAllAsync()
        {
            try
            {
                return await _dataStore.ReadAsync<List<Medicine>>(MEDICINES_FILE);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all medices");
                throw;
            }
        }

        public async Task<Medicine> GetByIdAsync(Guid id)
        {
                var medicines = await GetAllAsync();
                return medicines.FirstOrDefault(x => x.Id == id);
        }

        public async Task<List<SaleRecord>> GetSalesHistoryAsync()
        {
            try
            {
                var sales = await _dataStore.ReadAsync<List<SaleRecord>>(SALES_FILE);
                return sales.OrderByDescending(x => x.SaleDate).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving sales history");
                throw;
            }            
        }

        public async Task<SaleRecord> RecordSaleAsync(SaleRequest request)
        {
            var medicines = await GetAllAsync();
            var medicine = medicines.FirstOrDefault(x=>x.Id == request.MedicineId);
            if(medicine == null)
            {
                throw new KeyNotFoundException($"Medicine with ID {request.MedicineId} not found");
            }
            if( medicine.Quantity < request.Quantity)
            {
                throw new InvalidOperationException($"InSufficient Stock. Available: {medicine.Quantity}, Requested: {request.Quantity}");
            }
            medicine.Quantity-=request.Quantity;
            await _dataStore.WriteAsync(MEDICINES_FILE,medicines);

            var sale = new SaleRecord
            {
                Id = Guid.NewGuid(),
                MedicineID = medicine.Id,
                MedicineName = medicine.FullName,
                QuantitySold = request.Quantity,
                UnitPrice = medicine.Price,
                TotalAmount = medicine.Price * request.Quantity,
                SaleDate = DateTime.UtcNow
            };

            var sales = await _dataStore.ReadAsync <List<SaleRecord>>(SALES_FILE);
            sales.Add(sale);
            await _dataStore.WriteAsync(SALES_FILE,sales);
            _logger.LogInformation("Recorded sale: {MedicineName} x{Quantity} = {TotalAmount:C}",
                medicine.FullName, request.Quantity, sale.TotalAmount);

            return sale;
        }

        public async Task<List<Medicine>> SearchByNameAsync(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return await GetAllAsync();
            }
            var mediciens = await GetAllAsync();
            return mediciens.Where(x=> x.FullName.Contains(name)).ToList();
        }

        public async Task<Medicine> UpdateAsync(Guid id, Medicine medicine)
        {
            var medicines = await GetAllAsync();
            var existingMedicine = medicines.FirstOrDefault(m => m.Id == id);
            if (existingMedicine == null)
            {
                throw new KeyNotFoundException($"Medicine with Id {id} not found");
            }

            existingMedicine.FullName = medicine.FullName;
            existingMedicine.Notes = medicine.Notes;
            existingMedicine.ExpiryDate = medicine.ExpiryDate;
            existingMedicine.Quantity = medicine.Quantity;
            existingMedicine.Price = medicine.Price;
            existingMedicine.Brand = medicine.Brand;

            await _dataStore.WriteAsync(MEDICINES_FILE, medicines);
            _logger.LogInformation("Updated medicine : {MedicineName}(ID :{MedicineID})", medicine.FullName, medicine.Id);
            return existingMedicine;
        }
    }
}
