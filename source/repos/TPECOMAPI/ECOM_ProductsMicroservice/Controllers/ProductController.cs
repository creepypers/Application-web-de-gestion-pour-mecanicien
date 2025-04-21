using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Net;
using Microsoft.Extensions.Configuration;

namespace EC_Product_Service.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private ProductDbContext _productDbContext;
        private HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly string _gatewayUrl;

        public ProductController(IConfiguration configuration)
        {
            _configuration = configuration;
            _productDbContext = new ProductDbContext();
            _httpClient = new HttpClient();
            _gatewayUrl = _configuration["ApiGateway:Url"] ?? "http://localhost:5000";
        }

        [HttpGet(Name = "GetProducts")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public IActionResult GetProducts()
        {
            try
            {
                List<Models.Product> products = _productDbContext.Products.ToList();
                return Ok(products);
            }
            catch (Exception)
            {
                return BadRequest("Une erreur est surevenu lors du traitement de la requête !");
            }
        }

        [HttpPost(Name = "AddProduct")]
        [Authorize]
        [ProducesResponseType(typeof(Models.Product), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Created)]
        public async Task<IActionResult> AddProduct([FromBody] Models.ProductModel model)
        {
            try
            {
                HttpResponseMessage response = await _httpClient.GetAsync($"{_gatewayUrl}/api/users/vendeurs/{model.SellerId}");

                if (response.IsSuccessStatusCode)
                {
                    Models.Product product = new Models.Product() 
                    { 
                        Name = model.Name, 
                        SellerId = model.SellerId, 
                        Price = model.Price, 
                        Description = model.Description 
                    };

                    _productDbContext.Products.Add(product);
                    _productDbContext.SaveChanges();

                    return Created($"{Request.Host}{Request.PathBase}{Request.Path}{Request.QueryString}/{product.ProductId}", product);
                }
                else
                {
                    return NotFound($"Le vendeur avec l'Id ({model.SellerId}) fourni n'existe pas !");
                }
            }
            catch (Exception) 
            {
                return BadRequest("Une erreur est surevenu lors du traitement de la requête !");
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
                Models.Product? product = _productDbContext.Products.Find(productId);
                if (product is not null)
                {
                    _productDbContext.Products.Remove(product);
                    _productDbContext.SaveChanges();
                    return Ok($"Le produit avec l'Id ({productId}) a été supprimé avec succès.");
                }
                else
                    return NotFound($"Le produit avec l'Id ({productId}) fourni n'existe pas !");
            }
            catch (Exception)
            {
                return BadRequest("Une erreur est surevenu lors du traitement de la requête !");
            }
        }
    }
}
