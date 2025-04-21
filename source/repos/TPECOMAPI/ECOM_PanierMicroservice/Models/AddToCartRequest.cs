using System.ComponentModel.DataAnnotations;

namespace ECOM_PanierMicroservice.Models
{
    public class AddToCartRequest
    {
        [Required]
        public int ProductId { get; set; }
        
        [Required]
        public string Name { get; set; } = string.Empty;
        
        public string ImageUrl { get; set; } = string.Empty;
        
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public decimal Price { get; set; }
        
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
        public int Quantity { get; set; } = 1;
        
        public string? Variant { get; set; }
    }
} 