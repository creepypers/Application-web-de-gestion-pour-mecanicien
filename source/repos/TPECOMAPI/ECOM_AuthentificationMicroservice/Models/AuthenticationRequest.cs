using System.ComponentModel.DataAnnotations;

namespace ECOM_AuthentificationMicroservice.Models
{
    public class AuthenticationRequest
    {
        [Required]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        public string Password { get; set; } = string.Empty;
        
        // Indicates if this is a client or seller login
        [Required] 
        public string UserType { get; set; } = "Client"; // Default to Client
    }
} 