using ECOM_AuthentificationMicroservice.Models;
using ECOM_AuthentificationMicroservice.Services;
using Microsoft.AspNetCore.Mvc;

namespace ECOM_AuthentificationMicroservice.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthenticationResponse>> Login(AuthenticationRequest request)
        {
            var response = await _authService.Authenticate(request);
            
            if (!response.Success)
                return Unauthorized(response);
                
            return Ok(response);
        }

        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok("Authentication service is running!");
        }
    }
} 