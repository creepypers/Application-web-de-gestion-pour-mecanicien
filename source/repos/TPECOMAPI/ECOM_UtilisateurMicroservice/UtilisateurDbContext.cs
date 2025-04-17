
using Microsoft.EntityFrameworkCore;

namespace ECOM_UtilisateurMicroservice
{
    public class UtilisateurDbContext : DbContext
    {
        public DbSet<Models.Client> Clients { get; set; }
        public DbSet<Models.Seller> Sellers { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder dbContextOptionsBuilder)
        {
            string connection_string = "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=master;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False";
            string database_name = "ec_user_db";
            dbContextOptionsBuilder.UseSqlServer($"{connection_string};Database={database_name};");
        }
    }
}
