using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECOM_CommandesMicroservice.Models
{
    public class Order
    {
        public int OrderId { get; set; }
        public int ClientId { get; set; }
        [Column(TypeName = "decimal(10,2)")]
        public decimal TotalPrice { get; set; }
        public List<OrderItem>? Items { get; set; }
    }
}
