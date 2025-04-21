using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ECOM_ProductsMicroservice.Models
{
    public class Seller
    {
        public int SellerId { get; set; }
        public string? Name { get; set; }
        public float Profit { get; set; }
        
        [JsonIgnore]
        public ICollection<Product>? Products { get; set; }
    }
}
