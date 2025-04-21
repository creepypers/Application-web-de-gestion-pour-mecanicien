using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ECOM_ProductsMicroservice
{
    public class ProductDbContext : DbContext
    {
        public DbSet<Models.Product> Products { get; set; }
        public DbSet<Models.Seller> Sellers { get; set; }
        
        private readonly IConfiguration _configuration;
        
        public ProductDbContext(DbContextOptions<ProductDbContext> options, IConfiguration configuration = null) 
            : base(options)
        {
            _configuration = configuration;
        }
        
        public ProductDbContext()
        {
        }
        
        protected override void OnConfiguring(DbContextOptionsBuilder dbContextOptionsBuilder)
        {
            if (!dbContextOptionsBuilder.IsConfigured)
            {
                string connection_string = "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=master;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False";
                string database_name = "ec_product_db";
                dbContextOptionsBuilder.UseSqlServer($"{connection_string};Database={database_name};");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Models.Product>()
                .HasOne(p => p.Seller)
                .WithMany(s => s.Products)
                .HasForeignKey(p => p.SellerId);
                
            base.OnModelCreating(modelBuilder);
        }
    }
}
