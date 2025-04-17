namespace ECOM_AuthentificationMicroservice.Models
{
    public class AuthenticationResponse
    {
        public string Token { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string UserType { get; set; } = string.Empty;
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
    }
} 