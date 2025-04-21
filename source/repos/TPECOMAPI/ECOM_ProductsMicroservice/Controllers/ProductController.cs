using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Net;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using ECOM_ProductsMicroservice;
using ECOM_ProductsMicroservice.Models;

namespace ECOM_ProductsMicroservice.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ProductDbContext _productDbContext;
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly string _gatewayUrl;

        public ProductController(ProductDbContext productDbContext, IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            _productDbContext = productDbContext;
            _configuration = configuration;
            _httpClient = httpClientFactory.CreateClient();
            _gatewayUrl = _configuration["ApiGateway:Url"] ?? "http://localhost:8000";
        }

        [HttpGet(Name = "GetProducts")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public IActionResult GetProducts()
        {
            try
            {
                List<Product> products = _productDbContext.Products
                    .Include(p => p.Seller)
                    .ToList();
                return Ok(products);
            }
            catch (Exception)
            {
                return BadRequest("Une erreur est survenue lors du traitement de la requête !");
            }
        }

        [HttpGet("{productId}", Name = "GetProductById")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public IActionResult GetProductById(int productId)
        {
            try
            {
                Product? product = _productDbContext.Products
                    .Include(p => p.Seller)
                    .FirstOrDefault(p => p.ProductId == productId);

                if (product is not null)
                {
                    return Ok(product);
                }
                else
                {
                    return NotFound($"Le produit avec l'Id ({productId}) n'existe pas !");
                }
            }
            catch (Exception)
            {
                return BadRequest("Une erreur est survenue lors du traitement de la requête !");
            }
        }

        [HttpPost(Name = "AddProduct")]
        [Authorize]
        [ProducesResponseType(typeof(Product), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Created)]
        public IActionResult AddProduct([FromBody] ProductModel model)
        {
            try
            {
                // Check if seller exists in our database
                Seller? seller = _productDbContext.Sellers.Find(model.SellerId);
                
                if (seller != null)
                {
                    Product product = new Product() 
                    { 
                        Name = model.Name,
                        ShortDescription = model.ShortDescription,
                        Description = model.Description,
                        Price = model.Price,
                        Category = model.Category,
                        ImageUrl = model.ImageUrl,
                        IsNewArrival = model.IsNewArrival,
                        CreatedAt = DateTime.Now,
                        Rating = model.Rating,
                        SellerId = model.SellerId
                    };

                    _productDbContext.Products.Add(product);
                    _productDbContext.SaveChanges();

                    return Created($"{Request.Host}{Request.PathBase}{Request.Path}{Request.QueryString}/{product.ProductId}", product);
                }
                else
                {
                    return NotFound($"Le vendeur avec l'Id ({model.SellerId}) n'existe pas !");
                }
            }
            catch (Exception) 
            {
                return BadRequest("Une erreur est survenue lors du traitement de la requête !");
            }
        }

        [HttpDelete("{productId}", Name = "RemoveProduct")]
        [Authorize]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public IActionResult RemoveProduct(int productId)
        {
            try
            {
                Product? product = _productDbContext.Products.Find(productId);
                if (product is not null)
                {
                    _productDbContext.Products.Remove(product);
                    _productDbContext.SaveChanges();
                    return Ok($"Le produit avec l'Id ({productId}) a été supprimé avec succès.");
                }
                else
                    return NotFound($"Le produit avec l'Id ({productId}) n'existe pas !");
            }
            catch (Exception)
            {
                return BadRequest("Une erreur est survenue lors du traitement de la requête !");
            }
        }

        [HttpGet("category/{category}", Name = "GetProductsByCategory")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public IActionResult GetProductsByCategory(string category)
        {
            try
            {
                List<Product> products = _productDbContext.Products
                    .Include(p => p.Seller)
                    .Where(p => p.Category == category)
                    .ToList();
                
                return Ok(products);
            }
            catch (Exception)
            {
                return BadRequest("Une erreur est survenue lors du traitement de la requête !");
            }
        }

        [HttpGet("new-arrivals", Name = "GetNewArrivals")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public IActionResult GetNewArrivals()
        {
            try
            {
                List<Product> products = _productDbContext.Products
                    .Include(p => p.Seller)
                    .Where(p => p.IsNewArrival)
                    .ToList();
                
                return Ok(products);
            }
            catch (Exception)
            {
                return BadRequest("Une erreur est survenue lors du traitement de la requête !");
            }
        }

        [HttpGet("search", Name = "SearchProducts")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public IActionResult SearchProducts([FromQuery] string query)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(query))
                {
                    return BadRequest("Le terme de recherche ne peut pas être vide.");
                }

                List<Product> products = _productDbContext.Products
                    .Include(p => p.Seller)
                    .Where(p => p.Name.Contains(query) || 
                                p.Description.Contains(query) || 
                                p.ShortDescription.Contains(query))
                    .ToList();
                
                return Ok(products);
            }
            catch (Exception)
            {
                return BadRequest("Une erreur est survenue lors du traitement de la requête !");
            }
        }

        [HttpPut("{productId}", Name = "UpdateProduct")]
        [Authorize]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public IActionResult UpdateProduct(int productId, [FromBody] ProductModel model)
        {
            try
            {
                Product? product = _productDbContext.Products.Find(productId);
                
                if (product is null)
                {
                    return NotFound($"Le produit avec l'Id ({productId}) n'existe pas !");
                }
                
                // Check if seller exists in our database if SellerId changed
                if (product.SellerId != model.SellerId)
                {
                    Seller? seller = _productDbContext.Sellers.Find(model.SellerId);
                    if (seller is null)
                    {
                        return NotFound($"Le vendeur avec l'Id ({model.SellerId}) n'existe pas !");
                    }
                }
                
                // Update product properties
                product.Name = model.Name;
                product.ShortDescription = model.ShortDescription;
                product.Description = model.Description;
                product.Price = model.Price;
                product.Category = model.Category;
                product.ImageUrl = model.ImageUrl;
                product.IsNewArrival = model.IsNewArrival;
                product.Rating = model.Rating;
                product.SellerId = model.SellerId;
                
                _productDbContext.SaveChanges();
                
                return Ok(product);
            }
            catch (Exception)
            {
                return BadRequest("Une erreur est survenue lors du traitement de la requête !");
            }
        }
    }
}
