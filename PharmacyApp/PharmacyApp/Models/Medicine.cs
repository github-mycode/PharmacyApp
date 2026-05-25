using System.ComponentModel.DataAnnotations;

namespace PharmacyApp.Models
{
    public class Medicine
    {
        public Guid Id { get; set; }

        [Required(ErrorMessage ="Medicine name is required")]
        public string FullName {  get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        
        [Required]
        public DateTime ExpiryDate { get; set; }
        
        [Required]
        public int Quantity { get; set; }
        
        [Required]
        public decimal Price { get; set; }
        
        [Required(ErrorMessage ="Brand is required")]
        public string Brand { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }= DateTime.UtcNow;
    }
}
