using Microsoft.AspNetCore.Mvc;
using System.Net;

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

        [HttpGet("{sellerId}", Name = "GetSeller")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public IActionResult GetSeller(int sellerId)
        {
            try
            {
                Models.Seller? seller = _userDbContext.Sellers.Find(sellerId);
                if (seller is not null)
                    return Ok(seller);
                else
                    return NotFound($"L'utilisateur avec l'Id ({sellerId}) fourni n'existe pas !");
            }
            catch (Exception)
            {
                return BadRequest("Une erreur est surevenu lors du traitement de la requête !");
            }
        }

        [HttpDelete("{sellerId}", Name = "RemoveSeller")]
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
