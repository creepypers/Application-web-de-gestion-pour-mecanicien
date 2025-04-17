using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace E.Controllers
{
    [Route("api/orders")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private OrderDbContext _orderDbContext;
        private HttpClient _httpClient;

        public OrderController()
        {
            _orderDbContext = new OrderDbContext();
            _httpClient = new HttpClient();
        }

        [HttpGet("{orderId}", Name = "GetOrder")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public IActionResult GetOrder(int orderId)
        {
            try
            {
                Models.Order? order = _orderDbContext.Orders.Include(o => o.Items).Where(o => o.OrderId == orderId).First();
                if (order is not null)
                    return Ok(order);
                else
                    return NotFound($"La commande avec l'Id ({orderId}) fourni n'existe pas !");
            }
            catch (Exception)
            {
                return BadRequest("Une erreur est surevenu lors du traitement de la requête !");
            }
        }

        [HttpPost(Name = "AddOrder")]
        [ProducesResponseType(typeof(Models.Order), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Created)]
        public async Task<IActionResult> AddOrder([FromBody] Models.OrderModel model)
        {
            try
            {
                HttpResponseMessage response = await _httpClient.GetAsync($"http://localhost:5001/api/users/clients/{model.ClientId}");

                if (response.IsSuccessStatusCode)
                {
                    Models.Order order = new Models.Order()
                    {
                        ClientId = model.ClientId,
                        TotalPrice = 0
                };

                    _orderDbContext.Orders.Add(order);
                    _orderDbContext.SaveChanges();

                    return Created($"{Request.Host}{Request.PathBase}{Request.Path}{Request.QueryString}/{order.OrderId}", order);
                }
                else
                {
                    return NotFound($"Le client avec l'Id ({model.ClientId}) fourni n'existe pas !");
                }
            }
            catch (Exception)
            {
                return BadRequest("Une erreur est surevenu lors du traitement de la requête !");
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
