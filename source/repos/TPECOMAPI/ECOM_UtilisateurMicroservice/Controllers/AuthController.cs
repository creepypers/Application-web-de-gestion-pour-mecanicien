using ECOM_UtilisateurMicroservice.Models;
using ECOM_UtilisateurMicroservice.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace ECOM_UtilisateurMicroservice.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UtilisateurDbContext _userDbContext;
        private readonly AuthService _authService;

        public AuthController(UtilisateurDbContext userDbContext, AuthService authService)
        {
            _userDbContext = userDbContext;
            _authService = authService;
        }

        [HttpPost("login")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public IActionResult Login([FromBody] LoginModel loginModel)
        {
            try
            {
                var user = _userDbContext.Users.FirstOrDefault(u => 
                    u.Email == loginModel.Email && 
                    u.Password == loginModel.Password);
                
                if (user == null)
                {
                    return NotFound("Email ou mot de passe incorrect");
                }
                
                var token = _authService.GenerateJwtToken(user);
                
                return Ok(new { 
                    token = token,
                    user = new {
                        id = user.Id,
                        email = user.Email,
                        firstName = user.FirstName,
                        lastName = user.LastName,
                        userType = user.UserType
                    }
                });
            }
            catch (Exception)
            {
                return BadRequest("Une erreur est survenue lors du traitement de la requête !");
            }
        }
    }

    public class LoginModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
} 