using Microsoft.AspNetCore.Mvc;
using System.Net;
using Microsoft.AspNetCore.Authorization;
using System.Linq;

namespace ECOM_UtilisateurMicroservice.Controllers
{
    [Route("api/users/sellers")]
    [ApiController]
    public class SellerController : ControllerBase
    {
        private UtilisateurDbContext _userDbContext;

        public SellerController()
        {
            _userDbContext = new UtilisateurDbContext();
        }

        [HttpGet(Name = "GetSellers")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public IActionResult GetSellers()
        {
            try
            {
                List<Models.Seller> sellers = _userDbContext.Sellers.ToList();
                return Ok(sellers);
            }
            catch (Exception)
            {
                return BadRequest("Une erreur est surevenu lors du traitement de la requête !");
            }
        }

        [HttpPost(Name = "AddSeller")]
        [ProducesResponseType(typeof(Models.Seller), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Created)]
        public IActionResult AddUser([FromBody] Models.UserModel model)
        {
            try
            {
                Models.Seller seller = new Models.Seller() { Name = model.Name };
                _userDbContext.Sellers.Add(seller);
                _userDbContext.SaveChanges();
                return Created($"{Request.Host}{Request.PathBase}{Request.Path}{Request.QueryString}/{seller.SellerId}", seller);
            }
            catch (Exception)
            {
                return BadRequest("Une erreur est surevenu lors du traitement de la requête !");
            }
        }

        [HttpGet("{sellerId}")]
        [Authorize]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public IActionResult GetSeller(int sellerId)
        {
            try
            {
                // Check if user has access to this seller
                var userType = User.Claims.FirstOrDefault(c => c.Type == "UserType")?.Value;
                var userId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value ?? "0");
                
                // Only allow the seller to access their own data
                if (userType == "Seller" && userId != sellerId && userId != 0)
                {
                    return Forbid("You can only access your own seller data");
                }

                Models.Seller? seller = _userDbContext.Sellers.Find(sellerId);
                
                if (seller == null)
                {
                    return NotFound($"The seller with ID ({sellerId}) does not exist!");
                }
                
                return Ok(seller);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpDelete("{sellerId}")]
        [Authorize]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public IActionResult RemoveSeller(int sellerId)
        {
            try
            {
                Models.Seller? seller = _userDbContext.Sellers.Find(sellerId);
                if (seller is not null)
                {
                    _userDbContext.Sellers.Remove(seller);
                    _userDbContext.SaveChanges();
                    return Ok($"L'utilisateur avec l'Id ({sellerId}) a été supprimé avec succès.");
                }
                else
                    return NotFound($"L'utilisateur avec l'Id ({sellerId}) fourni n'existe pas !");
            }
            catch (Exception)
            {
                return BadRequest("Une erreur est surevenu lors du traitement de la requête !");
            }
        }
    }
}
