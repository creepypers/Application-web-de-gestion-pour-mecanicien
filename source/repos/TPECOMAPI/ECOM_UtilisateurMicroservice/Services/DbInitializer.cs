using ECOM_UtilisateurMicroservice.Models;
using Microsoft.EntityFrameworkCore;

namespace ECOM_UtilisateurMicroservice.Services
{
    public class DbInitializer
    {
        private readonly UtilisateurDbContext _context;
        private readonly DummyJsonService _dummyJsonService;
        private readonly ILogger<DbInitializer> _logger;

        public DbInitializer(
            UtilisateurDbContext context, 
            DummyJsonService dummyJsonService,
            ILogger<DbInitializer> logger)
        {
            _context = context;
            _dummyJsonService = dummyJsonService;
            _logger = logger;
        }

        public async Task InitializeDatabaseAsync()
        {
            try 
            {
                // Ensure the database is created
                await _context.Database.EnsureCreatedAsync();

                // Check if the database is already populated
                if (await _context.Users.AnyAsync())
                {
                    _logger.LogInformation("Database already populated. Skipping initialization.");
                    return;
                }

                // Fetch users from DummyJson
                var dummyUsers = await _dummyJsonService.GetUsersAsync();

                // Add users to the database
                _context.Users.AddRange(dummyUsers);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Successfully added {dummyUsers.Count} users to the database.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while initializing the database.");
                throw;
            }
        }
    }
} 