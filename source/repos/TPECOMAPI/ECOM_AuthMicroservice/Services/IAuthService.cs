using ECOM_AuthMicroservice.Models;

namespace ECOM_AuthMicroservice.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> AuthenticateAsync(LoginModel model);
    }
} 