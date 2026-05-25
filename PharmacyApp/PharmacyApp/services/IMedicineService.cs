using PharmacyApp.Models;

namespace PharmacyApp.services
{
    public interface IMedicineService
    {
        Task<List<Medicine>> GetAllAsync();
        Task<Medicine> GetByIdAsync(Guid id);
        Task<List<Medicine>> SearchByNameAsync(string name);
        Task<Medicine> AddAsync(Medicine medicine);
        Task<Medicine> UpdateAsync(Guid id,Medicine medicine);
        Task<bool> DeleteAsync(Guid id);
        Task<SaleRecord> RecordSaleAsync(SaleRequest request);
        Task<List<SaleRecord>> GetSalesHistoryAsync();
    }
}
