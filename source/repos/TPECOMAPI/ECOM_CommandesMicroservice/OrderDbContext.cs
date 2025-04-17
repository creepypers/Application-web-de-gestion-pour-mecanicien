using Microsoft.EntityFrameworkCore;

namespace EC_Order_Service
{
    public class OrderDbContext : DbContext
    {
        public DbSet<Models.Order> Orders { get; set; }
        public DbSet<Models.OrderItem> OrderItems { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder dbContextOptionsBuilder)
        {
            string connection_string = "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=master;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False";
            string database_name = "ec_order_db";
            dbContextOptionsBuilder.UseSqlServer($"{connection_string};Database={database_name};");
        }
    }
}
