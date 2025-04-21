using System.Collections.Generic;
using System.Linq;

namespace ECOM_PanierMicroservice.Models
{
    public class Cart
    {
        public string UserId { get; set; } = string.Empty;
        public List<CartItem> Items { get; set; } = new List<CartItem>();
        
        public decimal Subtotal => Items.Sum(i => i.Subtotal);
        public decimal ShippingCost => Subtotal > 0 ? 10.00m : 0;
        public decimal Tax => Subtotal * 0.07m;
        public decimal Total => Subtotal + ShippingCost + Tax;
    }
} 