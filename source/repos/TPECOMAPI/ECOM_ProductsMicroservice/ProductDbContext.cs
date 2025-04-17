using Microsoft.EntityFrameworkCore;

namespace EC_Product_Service
{
    public class ProductDbContext : DbContext
    {
        public DbSet<Models.Product> Products { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder dbContextOptionsBuilder)
        {
            string connection_string = "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=master;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False";
            string database_name = "ec_product_db";
            dbContextOptionsBuilder.UseSqlServer($"{connection_string};Database={database_name};");
        }
    }
}
