namespace ECOM_AuthMicroservice.Services
{
    public interface IJwtService
    {
        string GenerateJwtToken(int userId, string email, string userType);
    }
} 