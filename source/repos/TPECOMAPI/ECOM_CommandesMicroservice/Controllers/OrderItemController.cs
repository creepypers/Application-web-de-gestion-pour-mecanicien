using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Text.Json;

namespace ECOM_CommandesMicroservice.Controllers
{
    [Route("api/orders/items")]
    [ApiController]
    public class OrderItemController : ControllerBase
    {
        private readonly OrderDbContext _orderDbContext;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly JsonSerializerOptions _options;

        public OrderItemController(OrderDbContext orderDbContext, IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _orderDbContext = orderDbContext;
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        }

        [HttpGet("{orderItemId}", Name = "GetOrderItem")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public IActionResult GetOrderItem(int orderItemId)
        {
            try
            {
                var orderItem = _orderDbContext.OrderItems.Include(i => i.Order).FirstOrDefault(i => i.OrderItemId == orderItemId);
                if (orderItem is not null)
                    return Ok(orderItem);
                else
                    return NotFound($"La ligne de commande avec l'Id ({orderItemId}) fourni n'existe pas !");
            }
            catch (Exception ex)
            {
                return BadRequest($"Une erreur est survenue lors du traitement de la requête : {ex.Message}");
            }
        }

        [HttpPost(Name = "AddOrderItem")]
        [ProducesResponseType(typeof(Models.OrderItem), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Created)]
        public async Task<IActionResult> AddOrderItem([FromBody] Models.OrderItemModel model)
        {
            try
            {
                // Check if order exists
                var order = await _orderDbContext.Orders.FindAsync(model.OrderId);
                if (order == null)
                {
                    return NotFound($"La commande avec l'Id ({model.OrderId}) fourni n'existe pas !");
                }

                // Check if product exists
                var httpClient = _httpClientFactory.CreateClient();
                var productServiceUrl = _configuration["ServiceUrls:ProductService"] ?? "http://localhost:5002";
                
                var response = await httpClient.GetAsync($"{productServiceUrl}/api/products/{model.ProductId}");
                
                if (!response.IsSuccessStatusCode)
                {
                    return NotFound($"Le produit avec l'Id ({model.ProductId}) fourni n'existe pas !");
                }

                string responseContent = await response.Content.ReadAsStringAsync();
                var product = JsonSerializer.Deserialize<Models.Product>(responseContent, _options);

                // Create order item
                var orderItem = new Models.OrderItem()
                {
                    OrderId = model.OrderId,
                    ProductId = model.ProductId,
                    Quantity = model.Quantity,
                    Price = model.Quantity * product.Price
                };

                _orderDbContext.OrderItems.Add(orderItem);
                
                // Update order total price
                order.TotalPrice += orderItem.Price;
                _orderDbContext.Orders.Update(order);
                
                await _orderDbContext.SaveChangesAsync();

                return Created($"{Request.Scheme}://{Request.Host}{Request.Path}/{orderItem.OrderItemId}", orderItem);
            }
            catch (Exception ex)
            {
                return BadRequest($"Une erreur est survenue lors du traitement de la requête : {ex.Message}");
            }
        }

        [HttpDelete("{orderItemId}", Name = "RemoveOrderItem")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public async Task<IActionResult> RemoveOrderItem(int orderItemId)
        {
            try
            {
                var orderItem = await _orderDbContext.OrderItems.Include(i => i.Order).FirstOrDefaultAsync(i => i.OrderItemId == orderItemId);
                
                if (orderItem is not null)
                {
                    // Update order total price
                    if (orderItem.Order != null)
                    {
                        orderItem.Order.TotalPrice -= orderItem.Price;
                        _orderDbContext.Orders.Update(orderItem.Order);
                    }
                    
                    _orderDbContext.OrderItems.Remove(orderItem);
                    await _orderDbContext.SaveChangesAsync();
                    
                    return Ok($"La ligne de commande avec l'Id ({orderItemId}) a été supprimée avec succès.");
                }
                else
                {
                    return NotFound($"La ligne de commande avec l'Id ({orderItemId}) fourni n'existe pas !");
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Une erreur est survenue lors du traitement de la requête : {ex.Message}");
            }
        }
    }
}
