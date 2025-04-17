using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text.Json;

namespace E.Controllers
{
    [Route("api/orders/items")]
    [ApiController]
    public class OrderItemController : ControllerBase
    {
        private OrderDbContext _orderDbContext;
        private HttpClient _httpClient;
        JsonSerializerOptions _options;

        public OrderItemController()
        {
            _orderDbContext = new OrderDbContext();
            _httpClient = new HttpClient();
            _options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        }

        [HttpGet("{itemId}", Name = "GetOrderItem")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public IActionResult GetOrder(int orderItemId)
        {
            try
            {
                Models.OrderItem? orderItem = _orderDbContext.OrderItems.Find(orderItemId);
                if (orderItem is not null)
                    return Ok(orderItem);
                else
                    return NotFound($"La ligne de commande avec l'Id ({orderItemId}) fourni n'existe pas !");
            }
            catch (Exception)
            {
                return BadRequest("Une erreur est surevenu lors du traitement de la requête !");
            }
        }

        [HttpPost(Name = "AddOrderItem")]
        [ProducesResponseType(typeof(Models.OrderItem), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Created)]
        public async Task<IActionResult> AddOrderItem([FromBody] Models.OrderItemModel model)
        {
            try
            {
                HttpResponseMessage response = await _httpClient.GetAsync($"http://localhost:5001/api/products/{model.ProductId}");

                string responseContent = await response.Content.ReadAsStringAsync();
                Models.Product? product = JsonSerializer.Deserialize<Models.Product>(responseContent, _options);

                if (response.IsSuccessStatusCode)
                {
                    Models.OrderItem orderItem = new Models.OrderItem()
                    {
                        ProductId = model.ProductId,
                        Quantity = model.Quantity,
                        Price = model.Quantity * product.Price
                    };

                    _orderDbContext.OrderItems.Add(orderItem);
                    _orderDbContext.SaveChanges();

                    return Created($"{Request.Host}{Request.PathBase}{Request.Path}{Request.QueryString}/{orderItem.OrderId}", orderItem);
                }
                else
                {
                    return NotFound($"Le produit avec l'Id ({model.ProductId}) fourni n'existe pas !");
                }
            }
            catch (Exception)
            {
                return BadRequest("Une erreur est surevenu lors du traitement de la requête !");
            }
        }

        [HttpDelete("{itemId}", Name = "RemoveOrderItem")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public IActionResult RemoveOrderItem(int orderId)
        {
            try
            {
                Models.Order? order = _orderDbContext.Orders.Find(orderId);
                if (order is not null)
                {
                    _orderDbContext.Orders.Remove(order);
                    _orderDbContext.SaveChanges();
                    return Ok($"La commande avec l'Id ({orderId}) a été supprimé avec succès.");
                }
                else
                    return NotFound($"La commande avec l'Id ({orderId}) fourni n'existe pas !");
            }
            catch (Exception)
            {
                return BadRequest("Une erreur est surevenu lors du traitement de la requête !");
            }
        }
    }
}
