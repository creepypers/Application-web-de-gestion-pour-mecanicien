using System.ComponentModel.DataAnnotations;

namespace ECOM_ProductsMicroservice.Models
{
    public class Seller
    {
        public int SellerId { get; set; }
        public string? Name { get; set; }
        public float Profit { get; set; }
    }
}
