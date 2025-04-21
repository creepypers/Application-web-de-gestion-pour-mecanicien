using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace ECOM_CommandesMicroservice.Controllers
{
    [Route("api/orders")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly OrderDbContext _orderDbContext;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public OrderController(OrderDbContext orderDbContext, IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _orderDbContext = orderDbContext;
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public IActionResult GetAllOrders()
        {
            try
            {
                var orders = _orderDbContext.Orders.Include(o => o.Items).ToList();
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest($"Une erreur est survenue lors du traitement de la requête : {ex.Message}");
            }
        }

        [HttpGet("{orderId}", Name = "GetOrder")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public IActionResult GetOrder(int orderId)
        {
            try
            {
                var order = _orderDbContext.Orders.Include(o => o.Items).FirstOrDefault(o => o.OrderId == orderId);
                if (order is not null)
                    return Ok(order);
                else
                    return NotFound($"La commande avec l'Id ({orderId}) fourni n'existe pas !");
            }
            catch (Exception ex)
            {
                return BadRequest($"Une erreur est survenue lors du traitement de la requête : {ex.Message}");
            }
        }

        [HttpPost(Name = "AddOrder")]
        [ProducesResponseType(typeof(Models.Order), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Created)]
        public async Task<IActionResult> AddOrder([FromBody] Models.OrderModel model)
        {
            try
            {
                var httpClient = _httpClientFactory.CreateClient();
                var userServiceUrl = _configuration["ServiceUrls:UserService"] ?? "http://localhost:5001";
                
                HttpResponseMessage response = await httpClient.GetAsync($"{userServiceUrl}/api/users/clients/{model.ClientId}");

                if (response.IsSuccessStatusCode)
                {
                    Models.Order order = new Models.Order()
                    {
                        ClientId = model.ClientId,
                        TotalPrice = 0,
                        Items = new List<Models.OrderItem>()
                    };

                    _orderDbContext.Orders.Add(order);
                    _orderDbContext.SaveChanges();

                    return Created($"{Request.Scheme}://{Request.Host}{Request.Path}/{order.OrderId}", order);
                }
                else
                {
                    return NotFound($"Le client avec l'Id ({model.ClientId}) fourni n'existe pas !");
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Une erreur est survenue lors du traitement de la requête : {ex.Message}");
            }
        }

        [HttpDelete("{orderId}", Name = "RemoveOrder")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public IActionResult RemoveOrder(int orderId)
        {
            try
            {
                var order = _orderDbContext.Orders.Include(o => o.Items).FirstOrDefault(o => o.OrderId == orderId);
                if (order is not null)
                {
                    if (order.Items != null && order.Items.Any())
                    {
                        _orderDbContext.OrderItems.RemoveRange(order.Items);
                    }
                    
                    _orderDbContext.Orders.Remove(order);
                    _orderDbContext.SaveChanges();
                    
                    return Ok($"La commande avec l'Id ({orderId}) a été supprimée avec succès.");
                }
                else
                    return NotFound($"La commande avec l'Id ({orderId}) fourni n'existe pas !");
            }
            catch (Exception ex)
            {
                return BadRequest($"Une erreur est survenue lors du traitement de la requête : {ex.Message}");
            }
        }
    }
}
