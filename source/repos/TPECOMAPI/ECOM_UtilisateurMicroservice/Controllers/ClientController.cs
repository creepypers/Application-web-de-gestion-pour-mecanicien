using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace ECOM_UtilisateurMicroservice.Controllers
{
    [Route("api/users/clients")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        private UtilisateurDbContext _userDbContext;

        public ClientController()
        {
            _userDbContext = new UtilisateurDbContext();
        }

        [HttpGet(Name = "GetClients")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public IActionResult GetClients()
        {
            try
            {
                List<Models.Client> clients = _userDbContext.Clients.ToList();
                return Ok(clients);
            }
            catch (Exception)
            {
                return BadRequest("Une erreur est surevenu lors du traitement de la requête !");
            }
        }

        [HttpPost(Name = "AddClient")]
        [ProducesResponseType(typeof(Models.Client), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Created)]
        public IActionResult AddUser([FromBody] Models.UserModel model)
        {
            try
            {
                Models.Client client = new Models.Client() { Name = model.Name };
                _userDbContext.Clients.Add(client);
                _userDbContext.SaveChanges();
                return Created($"{Request.Host}{Request.PathBase}{Request.Path}{Request.QueryString}/{client.ClientId}", client);
            }
            catch (Exception)
            {
                return BadRequest("Une erreur est surevenu lors du traitement de la requête !");
            }
        }

        [HttpGet("{clientId}", Name = "GetClient")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public IActionResult GetClient(int clientId)
        {
            try
            {
                Models.Client? client = _userDbContext.Clients.Find(clientId);
                if (client is not null)
                    return Ok(client);
                else
                    return NotFound($"L'utilisateur avec l'Id ({clientId}) fourni n'existe pas !");
            }
            catch (Exception)
            {
                return BadRequest("Une erreur est surevenu lors du traitement de la requête !");
            }
        }

        [HttpDelete("{clientId}", Name = "RemoveClient")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public IActionResult RemoveClient(int clientId)
        {
            try
            {
                Models.Client? client = _userDbContext.Clients.Find(clientId);
                if (client is not null)
                {
                    _userDbContext.Clients.Remove(client);
                    _userDbContext.SaveChanges();
                    return Ok($"L'utilisateur avec l'Id ({clientId}) a été supprimé avec succès.");
                }
                else
                    return NotFound($"L'utilisateur avec l'Id ({clientId}) fourni n'existe pas !");
            }
            catch (Exception)
            {
                return BadRequest("Une erreur est surevenu lors du traitement de la requête !");
            }
        }
    }
}