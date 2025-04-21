using ECOM_PanierMicroservice.Models;
using System.Collections.Concurrent;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ECOM_PanierMicroservice.Services
{
    public interface ICartService
    {
        Task<Cart> GetCartAsync(string userId);
        Task<Cart> AddToCartAsync(string userId, CartItem item);
        Task<Cart> UpdateQuantityAsync(string userId, int productId, int quantity);
        Task<Cart> RemoveFromCartAsync(string userId, int productId);
        Task<Cart> ClearCartAsync(string userId);
    }

    public class CartService : ICartService
    {
        // In-memory storage for carts
        private readonly ConcurrentDictionary<string, Cart> _carts = new();

        public Task<Cart> GetCartAsync(string userId)
        {
            if (string.IsNullOrEmpty(userId))
                throw new ArgumentException("User ID cannot be empty");

            var cart = _carts.GetOrAdd(userId, new Cart { UserId = userId });
            return Task.FromResult(cart);
        }

        public async Task<Cart> AddToCartAsync(string userId, CartItem item)
        {
            if (string.IsNullOrEmpty(userId))
                throw new ArgumentException("User ID cannot be empty");
            
            if (item == null)
                throw new ArgumentNullException(nameof(item));

            var cart = await GetCartAsync(userId);
            
            var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == item.ProductId);
            
            if (existingItem != null)
            {
                existingItem.Quantity += item.Quantity;
            }
            else
            {
                cart.Items.Add(item);
            }
            
            return cart;
        }

        public async Task<Cart> UpdateQuantityAsync(string userId, int productId, int quantity)
        {
            if (string.IsNullOrEmpty(userId))
                throw new ArgumentException("User ID cannot be empty");
            
            var cart = await GetCartAsync(userId);
            var item = cart.Items.FirstOrDefault(i => i.ProductId == productId);
            
            if (item != null)
            {
                if (quantity <= 0)
                {
                    cart.Items.Remove(item);
                }
                else
                {
                    item.Quantity = quantity;
                }
            }
            
            return cart;
        }

        public async Task<Cart> RemoveFromCartAsync(string userId, int productId)
        {
            if (string.IsNullOrEmpty(userId))
                throw new ArgumentException("User ID cannot be empty");
            
            var cart = await GetCartAsync(userId);
            var item = cart.Items.FirstOrDefault(i => i.ProductId == productId);
            
            if (item != null)
            {
                cart.Items.Remove(item);
            }
            
            return cart;
        }

        public async Task<Cart> ClearCartAsync(string userId)
        {
            if (string.IsNullOrEmpty(userId))
                throw new ArgumentException("User ID cannot be empty");
            
            var cart = await GetCartAsync(userId);
            cart.Items.Clear();
            
            return cart;
        }
    }
} 