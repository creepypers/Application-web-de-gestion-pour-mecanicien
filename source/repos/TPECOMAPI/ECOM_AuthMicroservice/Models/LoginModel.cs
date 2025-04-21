using System.ComponentModel.DataAnnotations;

namespace ECOM_AuthMicroservice.Models
{
    public class LoginModel
    {
        [Required(ErrorMessage = "L'email est obligatoire")]
        [EmailAddress(ErrorMessage = "Format d'email invalide")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Le mot de passe est obligatoire")]
        public string? Password { get; set; }
    }
} 