using ECOM_AuthMicroservice.Models;
using System.Net.Http.Json;
using System.Text.Json;

namespace ECOM_AuthMicroservice.Services
{
    public class AuthService : IAuthService
    {
        private readonly HttpClient _httpClient;
        private readonly IJwtService _jwtService;
        private readonly IConfiguration _configuration;
        private readonly string _gatewayUrl;

        public AuthService(HttpClient httpClient, IJwtService jwtService, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _jwtService = jwtService;
            _configuration = configuration;
            
            // Use the API Gateway for inter-service communication
            _gatewayUrl = _configuration["ApiGateway:Url"] ?? "http://localhost:5000";
        }

        public async Task<AuthResponse> AuthenticateAsync(LoginModel model)
        {
            try
            {
                // Get the user by email directly through the API Gateway
                var response = await _httpClient.GetAsync($"{_gatewayUrl}/api/users/by-email/{model.Email}");
                
                if (!response.IsSuccessStatusCode)
                {
                    return new AuthResponse
                    {
                        Success = false,
                        Message = "Identifiants invalides"
                    };
                }

                // Read the user data from the response
                var userData = await response.Content.ReadFromJsonAsync<UserDto>();
                
                if (userData == null)
                {
                    return new AuthResponse
                    {
                        Success = false,
                        Message = "Erreur lors de la récupération des données utilisateur"
                    };
                }

                // Validate password (this should be hashed in a real application)
                if (userData.Password != model.Password)
                {
                    return new AuthResponse
                    {
                        Success = false,
                        Message = "Identifiants invalides"
                    };
                }

                // Generate JWT token
                var token = _jwtService.GenerateJwtToken(userData.Id, userData.Email ?? "", userData.UserType);

                return new AuthResponse
                {
                    Success = true,
                    Token = token,
                    UserId = userData.Id,
                    UserType = userData.UserType,
                    Message = "Authentification réussie"
                };
            }
            catch (Exception ex)
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = $"Erreur d'authentification: {ex.Message}"
                };
            }
        }
    }
} 