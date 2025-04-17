namespace ECOM_UtilisateurMicroservice.Models
{
    public class Seller
    {
        public int SellerId { get; set; }
        public string? Name { get; set; }
        public float? Profit { get; set; } = 0;
    }
}
