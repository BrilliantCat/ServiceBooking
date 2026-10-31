using System.Text.Unicode;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServiceBooking.Api.Data;
using ServiceBooking.Api.Models;

namespace ServiceBooking.Api.Controllers
{

    public static class PasswordHasher{
        public static string HashPassword(string password){
            var bytes = System.Text.Encoding.UTF8.GetBytes(password);
            var hash = System.Security.Cryptography.SHA256.HashData(bytes);
            return Convert.ToBase64String(hash);
        }

        public static bool VerifyPassword(string input, string hash){
            return HashPassword(input) == hash;
        }        
        
    }




    [ApiController]
    [Route("api/[controller]")]
    public class ClientsController : ControllerBase
    {
        private readonly DataBaseContext _dataBaseContext;
        public ClientsController(DataBaseContext dataBaseContext)
        {
            _dataBaseContext = dataBaseContext;
        }

        //Получаем список пользователей
        [HttpGet]
        public async Task<IActionResult> GetListClients()
        {
            return Ok(await _dataBaseContext.clients.ToListAsync());
        }

        // Получаем пользователя 
        [HttpGet("{id}")]
        public async Task<IActionResult> GetClientById(int id)
        {
            Client? temp = await _dataBaseContext.clients.FindAsync(id);
            if (temp == null) return NotFound();
            return Ok(temp);
        }

        //Создаем пользователя
        [HttpPost]
        public async Task<IActionResult> CreateClient(Client newClient)
        {
            if(!await _dataBaseContext.clients.AnyAsync(x=>x.phoneClient == newClient.phoneClient || (newClient.nameClient == "root" && x.nameClient == "root")))
            {
                var temp = newClient.passwordClient;
                newClient.passwordClient = PasswordHasher.HashPassword(temp);
                await _dataBaseContext.clients.AddAsync(newClient);
                await _dataBaseContext.SaveChangesAsync();
                newClient.passwordClient = temp;
                return Ok(newClient);
            }
            return BadRequest(); 
        }
        //Удоляем пользователя 
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClientById(int id)
        {
            Client? temp = await _dataBaseContext.clients.FindAsync(id);
            if (temp == null) return NotFound();
            if (temp.nameClient == "root") return BadRequest("Удаление учетной записи администратора запрещено");
            _dataBaseContext.clients.Remove(temp);
            await _dataBaseContext.SaveChangesAsync();
            return NoContent();
        }
        // Меняем данные 
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateClient(int id, Client updateClient)
        {
            if(id != updateClient.idClient) return BadRequest();
            Client? temp = await _dataBaseContext.clients.FindAsync(id);
            if (temp == null) return NotFound();
            if(await _dataBaseContext.clients.AnyAsync( x => x.phoneClient == updateClient.phoneClient && x.idClient != updateClient.idClient)) return BadRequest();
            temp.nameClient = updateClient.nameClient;
            temp.phoneClient = updateClient.phoneClient;
            temp.emailClient = updateClient.emailClient;

            if (!PasswordHasher.VerifyPassword(updateClient.passwordClient, temp.passwordClient))
            {
                temp.passwordClient = PasswordHasher.HashPassword(updateClient.passwordClient);
            }
            
            await _dataBaseContext.SaveChangesAsync();
            return NoContent();
        }

        

        [HttpPost("login")]
        public async Task<IActionResult> LoginClient(LoginDto client){
            Client? temp = await _dataBaseContext.clients.FirstOrDefaultAsync(x => x.phoneClient == client.phoneClient);
            if (temp == null) return NotFound();
            if (PasswordHasher.VerifyPassword(client.passwordClient, temp.passwordClient)) return Ok(temp);
            return Unauthorized("Неверный пароль");
        }
    }
}
 