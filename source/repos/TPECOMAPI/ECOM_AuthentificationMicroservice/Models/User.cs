namespace ECOM_AuthentificationMicroservice.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string UserType { get; set; } = string.Empty; // "Client" or "Seller"
    }
} 