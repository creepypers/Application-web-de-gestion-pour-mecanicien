using ECOM_AuthentificationMicroservice.Models;
using ECOM_AuthentificationMicroservice.DbContext;
using Microsoft.EntityFrameworkCore;

namespace ECOM_AuthentificationMicroservice.Services
{
    public class AuthService
    {
        private readonly JwtService _jwtService;
        private readonly AuthDbContext _dbContext;

        public AuthService(JwtService jwtService, AuthDbContext dbContext)
        {
            _jwtService = jwtService;
            _dbContext = dbContext;
        }

        public async Task<AuthenticationResponse> Authenticate(AuthenticationRequest request)
        {
            if (request.UserType.ToLower() == "client")
            {
                return await AuthenticateClient(request);
            }
            else if (request.UserType.ToLower() == "seller")
            {
                return await AuthenticateSeller(request);
            }
            
            return new AuthenticationResponse
            {
                Success = false,
                Message = "Invalid user type. Please specify 'Client' or 'Seller'."
            };
        }

        private async Task<AuthenticationResponse> AuthenticateClient(AuthenticationRequest request)
        {
            var client = await _dbContext.Clients
                .FirstOrDefaultAsync(c => c.Name == request.Username);

            if (client == null)
            {
                return new AuthenticationResponse
                {
                    Success = false,
                    Message = "Client not found"
                };
            }

            // In a real application, you would validate the password here
            // For this demo, we'll skip password validation
            
            // Generate a JWT token
            var user = new User
            {
                Id = client.ClientId,
                Name = client.Name ?? string.Empty,
                UserType = "Client"
            };

            string token = _jwtService.GenerateJwtToken(user);

            return new AuthenticationResponse
            {
                Success = true,
                Token = token,
                UserId = client.ClientId,
                Name = client.Name ?? string.Empty,
                UserType = "Client",
                Message = "Authentication successful"
            };
        }

        private async Task<AuthenticationResponse> AuthenticateSeller(AuthenticationRequest request)
        {
            // Similar logic for sellers
            var seller = await _dbContext.Sellers
                .FirstOrDefaultAsync(s => s.Name == request.Username);

            if (seller == null)
            {
                return new AuthenticationResponse
                {
                    Success = false,
                    Message = "Seller not found"
                };
            }

            // In a real application, you would validate the password here
            
            // Generate a JWT token
            var user = new User
            {
                Id = seller.SellerId,
                Name = seller.Name ?? string.Empty,
                UserType = "Seller"
            };

            string token = _jwtService.GenerateJwtToken(user);

            return new AuthenticationResponse
            {
                Success = true,
                Token = token,
                UserId = seller.SellerId,
                Name = seller.Name ?? string.Empty,
                UserType = "Seller",
                Message = "Authentication successful"
            };
        }
    }
} 