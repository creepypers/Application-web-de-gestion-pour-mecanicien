using Microsoft.AspNetCore.Mvc;
using ECOM_PanierMicroservice.Models;
using ECOM_PanierMicroservice.Services;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace ECOM_PanierMicroservice.Controllers
{
    [ApiController]
    [Route("api/cart")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpGet]
        public async Task<ActionResult<Cart>> GetCart()
        {
            // In a real application, get the userId from the claims
            string userId = GetUserIdFromClaims();
            var cart = await _cartService.GetCartAsync(userId);
            return cart;
        }

        [HttpPost("add")]
        public async Task<ActionResult<Cart>> AddToCart([FromBody] AddToCartRequest request)
        {
            if (request == null)
                return BadRequest("Request cannot be null");

            var cartItem = new CartItem
            {
                ProductId = request.ProductId,
                Name = request.Name,
                ImageUrl = request.ImageUrl,
                Price = request.Price,
                Quantity = request.Quantity,
                Variant = request.Variant
            };

            string userId = GetUserIdFromClaims();
            var cart = await _cartService.AddToCartAsync(userId, cartItem);
            return cart;
        }

        [HttpPut("update/{productId}")]
        public async Task<ActionResult<Cart>> UpdateQuantity(int productId, [FromBody] int quantity)
        {
            if (quantity < 0)
                return BadRequest("Quantity cannot be negative");

            string userId = GetUserIdFromClaims();
            var cart = await _cartService.UpdateQuantityAsync(userId, productId, quantity);
            return cart;
        }

        [HttpDelete("remove/{productId}")]
        public async Task<ActionResult<Cart>> RemoveFromCart(int productId)
        {
            string userId = GetUserIdFromClaims();
            var cart = await _cartService.RemoveFromCartAsync(userId, productId);
            return cart;
        }

        [HttpDelete("clear")]
        public async Task<ActionResult<Cart>> ClearCart()
        {
            string userId = GetUserIdFromClaims();
            var cart = await _cartService.ClearCartAsync(userId);
            return cart;
        }

        private string GetUserIdFromClaims()
        {
            // In a real application, get the user ID from the JWT claims
            // For now, we'll use a default value
            return User.Identity?.IsAuthenticated == true 
                ? User.FindFirst("sub")?.Value ?? "anonymous-user"
                : "anonymous-user";
        }
    }
} 