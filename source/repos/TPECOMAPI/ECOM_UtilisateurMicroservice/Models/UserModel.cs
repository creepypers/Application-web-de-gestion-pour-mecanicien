using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.ComponentModel.DataAnnotations;

namespace ECOM_UtilisateurMicroservice.Models
{
    public class UserModel
    {
        [Required]
        public string? Name { get; set; }
    }
}
