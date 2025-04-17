using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECOM_ProductsMicroservice.Models
{
    public class ProductModel
    {
        [Required]
        public string? Name { get; set; }
        [Required]
        public string? Description { get; set; }
        [Required, Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }
        [Required]
        public int SellerId { get; set; }
    }
}
