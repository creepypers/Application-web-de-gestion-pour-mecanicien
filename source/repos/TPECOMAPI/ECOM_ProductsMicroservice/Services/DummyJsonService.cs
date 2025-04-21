using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using ECOM_ProductsMicroservice.Models;

namespace ECOM_ProductsMicroservice.Services
{
    public class DummyJsonService
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl = "https://dummyjson.com";

        public DummyJsonService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<Seller>> GetSellersAsync()
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}/users?limit=50");
            response.EnsureSuccessStatusCode();
            
            var content = await response.Content.ReadAsStringAsync();
            var dummyUsers = JsonSerializer.Deserialize<DummyUsersResponse>(content, 
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            
            var sellers = new List<Seller>();
            
            foreach (var dummyUser in dummyUsers.Users)
            {
                var seller = new Seller
                {
                    Name = $"{dummyUser.FirstName} {dummyUser.LastName}",
                    Profit = 0
                };
                
                sellers.Add(seller);
            }
            
            return sellers;
        }

        public async Task<List<Product>> GetProductsAsync(List<Seller> sellers)
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}/products?limit=100");
            response.EnsureSuccessStatusCode();
            
            var content = await response.Content.ReadAsStringAsync();
            var dummyProducts = JsonSerializer.Deserialize<DummyProductsResponse>(content, 
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            
            var products = new List<Product>();
            var random = new Random();
            
            foreach (var dummyProduct in dummyProducts.Products)
            {
                // Assign a random seller
                var sellerId = sellers[random.Next(sellers.Count)].SellerId;
                
                var product = new Product
                {
                    Name = dummyProduct.Title,
                    ShortDescription = dummyProduct.Description.Length > 100 
                        ? dummyProduct.Description.Substring(0, 100) + "..." 
                        : dummyProduct.Description,
                    Description = dummyProduct.Description,
                    Price = dummyProduct.Price,
                    Category = dummyProduct.Category,
                    ImageUrl = dummyProduct.Thumbnail,
                    IsNewArrival = dummyProduct.Stock < 10,
                    CreatedAt = DateTime.Now.AddDays(-random.Next(1, 90)),
                    SellerId = sellerId,
                    Rating = dummyProduct.Rating
                };
                
                products.Add(product);
            }
            
            return products;
        }
    }

    public class DummyUsersResponse
    {
        public List<DummyUser> Users { get; set; }
        public int Total { get; set; }
        public int Skip { get; set; }
        public int Limit { get; set; }
    }

    public class DummyUser
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public DummyCompany Company { get; set; }
    }

    public class DummyCompany
    {
        public string Department { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public DummyAddress Address { get; set; }
    }

    public class DummyAddress
    {
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string PostalCode { get; set; }
    }

    public class DummyProductsResponse
    {
        public List<DummyProduct> Products { get; set; }
        public int Total { get; set; }
        public int Skip { get; set; }
        public int Limit { get; set; }
    }

    public class DummyProduct
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public decimal Price { get; set; }
        public double DiscountPercentage { get; set; }
        public double Rating { get; set; }
        public int Stock { get; set; }
        public string Brand { get; set; }
        public string Thumbnail { get; set; }
        public List<string> Images { get; set; }
    }
} 