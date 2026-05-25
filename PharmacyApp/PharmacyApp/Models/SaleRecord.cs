namespace PharmacyApp.Models
{
    public class SaleRecord
    {
        public Guid Id { get;set; }
        public Guid MedicineID { get; set; }
        public string MedicineName { get; set; }   = string.Empty;
        public int QuantitySold { get; set; }    
        public decimal UnitPrice {  get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime SaleDate {  get; set; }
    }
}
