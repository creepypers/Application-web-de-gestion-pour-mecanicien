using System.ComponentModel.DataAnnotations;

namespace ECOM_CommandesMicroservice.Models
{
    public class OrderItemModel
    {
        [Required]
        public int ProductId { get; set; }
        [Required]
        public int Quantity { get; set; }
        [Required]
        public int OrderId { get; set; }
    }
}
