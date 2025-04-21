namespace ECOM_AuthMicroservice.Models
{
    public class AuthResponse
    {
        public bool Success { get; set; }
        public string? Token { get; set; }
        public string? Message { get; set; }
        public int? UserId { get; set; }
        public string? UserType { get; set; }
    }
} 