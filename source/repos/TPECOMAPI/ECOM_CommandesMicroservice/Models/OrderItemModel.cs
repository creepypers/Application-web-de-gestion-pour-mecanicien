using System.ComponentModel.DataAnnotations;

namespace EC_Order_Service.Models
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
