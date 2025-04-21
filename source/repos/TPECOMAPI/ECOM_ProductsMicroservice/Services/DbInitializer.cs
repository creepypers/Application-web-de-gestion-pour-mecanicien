using ECOM_ProductsMicroservice.Models;
using Microsoft.EntityFrameworkCore;

namespace ECOM_ProductsMicroservice.Services
{
    public class DbInitializer
    {
        private readonly ProductDbContext _context;
        private readonly DummyJsonService _dummyJsonService;

        public DbInitializer(ProductDbContext context, DummyJsonService dummyJsonService)
        {
            _context = context;
            _dummyJsonService = dummyJsonService;
        }

        public async Task InitializeAsync()
        {
            // Ensure database is created
            await _context.Database.EnsureCreatedAsync();

            // Skip if we already have sellers in the database
            if (_context.Sellers.Any())
            {
                return;
            }

            // Get sellers from DummyJSON
            var sellers = await _dummyJsonService.GetSellersAsync();
            
            // Add sellers to the database
            await _context.Sellers.AddRangeAsync(sellers);
            await _context.SaveChangesAsync();
            
            // Reload sellers to get their IDs after saving
            var savedSellers = await _context.Sellers.ToListAsync();
            
            // Get products from DummyJSON
            var products = await _dummyJsonService.GetProductsAsync(savedSellers);
            
            // Add products to the database
            await _context.Products.AddRangeAsync(products);
            await _context.SaveChangesAsync();
        }
    }
} 