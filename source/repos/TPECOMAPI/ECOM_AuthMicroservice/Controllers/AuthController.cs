using ECOM_AuthMicroservice.Models;
using ECOM_AuthMicroservice.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECOM_AuthMicroservice.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.AuthenticateAsync(model);

            if (!result.Success)
            {
                return Unauthorized(result);
            }

            return Ok(result);
        }
        
        [HttpGet("validate")]
        [Authorize]
        public IActionResult ValidateToken()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var userType = User.FindFirst("UserType")?.Value;
            
            return Ok(new
            {
                IsAuthenticated = true,
                UserId = userId,
                Email = email,
                UserType = userType
            });
        }
        
        [HttpGet("user")]
        [Authorize]
        public IActionResult GetCurrentUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var userType = User.FindFirst("UserType")?.Value;
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }
            
            return Ok(new
            {
                Id = userId,
                Email = email,
                UserType = userType
            });
        }
        
        [HttpGet("test")]
        [AllowAnonymous]
        public IActionResult Test()
        {
            return Ok(new
            {
                Message = "Auth service is working correctly",
                Time = DateTime.UtcNow
            });
        }
    }
} 