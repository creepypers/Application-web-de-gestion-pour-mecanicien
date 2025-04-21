using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Net;
using ECOM_ProductsMicroservice;
using ECOM_ProductsMicroservice.Models;
using Microsoft.EntityFrameworkCore;

namespace ECOM_ProductsMicroservice.Controllers
{
    [Route("api/sellers")]
    [ApiController]
    public class SellerController : ControllerBase
    {
        private readonly ProductDbContext _productDbContext;

        public SellerController(ProductDbContext productDbContext)
        {
            _productDbContext = productDbContext;
        }

        [HttpGet(Name = "GetSellers")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public IActionResult GetSellers()
        {
            try
            {
                List<Seller> sellers = _productDbContext.Sellers.ToList();
                return Ok(sellers);
            }
            catch (Exception)
            {
                return BadRequest("Une erreur est survenue lors du traitement de la requête !");
            }
        }

        [HttpGet("{sellerId}", Name = "GetSellerById")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public IActionResult GetSellerById(int sellerId)
        {
            try
            {
                Seller? seller = _productDbContext.Sellers.Find(sellerId);
                if (seller is not null)
                {
                    return Ok(seller);
                }
                else
                {
                    return NotFound($"Le vendeur avec l'Id ({sellerId}) n'existe pas !");
                }
            }
            catch (Exception)
            {
                return BadRequest("Une erreur est survenue lors du traitement de la requête !");
            }
        }

        [HttpPost(Name = "AddSeller")]
        [Authorize]
        [ProducesResponseType(typeof(Seller), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Created)]
        public IActionResult AddSeller([FromBody] Seller seller)
        {
            try
            {
                _productDbContext.Sellers.Add(seller);
                _productDbContext.SaveChanges();

                return Created($"{Request.Host}{Request.PathBase}{Request.Path}{Request.QueryString}/{seller.SellerId}", seller);
            }
            catch (Exception)
            {
                return BadRequest("Une erreur est survenue lors du traitement de la requête !");
            }
        }

        [HttpDelete("{sellerId}", Name = "RemoveSeller")]
        [Authorize]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public IActionResult RemoveSeller(int sellerId)
        {
            try
            {
                Seller? seller = _productDbContext.Sellers.Find(sellerId);
                if (seller is not null)
                {
                    _productDbContext.Sellers.Remove(seller);
                    _productDbContext.SaveChanges();
                    return Ok($"Le vendeur avec l'Id ({sellerId}) a été supprimé avec succès.");
                }
                else
                {
                    return NotFound($"Le vendeur avec l'Id ({sellerId}) n'existe pas !");
                }
            }
            catch (Exception)
            {
                return BadRequest("Une erreur est survenue lors du traitement de la requête !");
            }
        }

        [HttpGet("{sellerId}/products", Name = "GetSellerProducts")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public IActionResult GetSellerProducts(int sellerId)
        {
            try
            {
                var seller = _productDbContext.Sellers.Find(sellerId);
                if (seller is null)
                {
                    return NotFound($"Le vendeur avec l'Id ({sellerId}) n'existe pas !");
                }

                var products = _productDbContext.Products
                    .Where(p => p.SellerId == sellerId)
                    .ToList();
                return Ok(products);
            }
            catch (Exception)
            {
                return BadRequest("Une erreur est survenue lors du traitement de la requête !");
            }
        }
    }
} 