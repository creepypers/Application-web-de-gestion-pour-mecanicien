using Microsoft.EntityFrameworkCore;
using ECOM_UtilisateurMicroservice;
using ECOM_UtilisateurMicroservice.Models;

namespace ECOM_AuthentificationMicroservice.DbContext
{
    public class AuthDbContext : UtilisateurDbContext
    {
        // This class inherits from the User microservice's DbContext
        // It already has access to Clients and Sellers DbSets
    }
} 