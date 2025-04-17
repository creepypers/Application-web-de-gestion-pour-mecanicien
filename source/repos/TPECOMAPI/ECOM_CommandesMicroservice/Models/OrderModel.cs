using System.ComponentModel.DataAnnotations;

namespace EC_Order_Service.Models
{
    public class OrderModel
    {
        [Required]
        public int ClientId { get; set; }
        [Required]
        public decimal TotalPrice { get; set; }
    }
}
