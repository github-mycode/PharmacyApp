using System.ComponentModel.DataAnnotations;

namespace PharmacyApp.Models
{
    public class SaleRequest
    {
        [Required]
        public Guid MedicineId { get; set; }

        [Required]
        public int Quantity { get; set; }
    }
}
