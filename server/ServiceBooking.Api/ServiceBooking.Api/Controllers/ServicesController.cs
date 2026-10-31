using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServiceBooking.Api.Data;
using ServiceBooking.Api.Models;

namespace ServiceBooking.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly DataBaseContext _dataBaseContext;
        public ServicesController(DataBaseContext dataBaseContext)
        {
            _dataBaseContext = dataBaseContext;
        }
        // Получаем список всех услуг
        [HttpGet]
        public async Task<IActionResult> GetListService ()
        {
            return Ok(await _dataBaseContext.services.ToListAsync());

        }

        // Добовляем услугу
        [HttpPost]
        public async Task<IActionResult> AddService(Service temp)
        {

            if (!await _dataBaseContext.services.AnyAsync(x=>x.nameService == temp.nameService))
            {
                await _dataBaseContext.services.AddAsync(temp);
                await _dataBaseContext.SaveChangesAsync();
                return Ok(temp);
            }
            return BadRequest();
        }

        // Получаем конкретную услугу
        [HttpGet("{id}")]
        public async Task<IActionResult> GetServiceById(int id)
        {
            Service? temp = await _dataBaseContext.services.FindAsync(id);
            if(temp == null) return NotFound();
            return Ok(temp);
        }
        
        // Удоляем конкретную услугу
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteServiceById(int id)
        {
            Service? temp = await _dataBaseContext.services.FindAsync(id);
            if (temp == null) return NotFound();
            _dataBaseContext.services.Remove(temp);
            await _dataBaseContext.SaveChangesAsync();
            return NoContent();
        }

        // Обновляем информацию у конкретной услуги
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateService(int id, Service updateService)
        {
            if(id != updateService.idService) return BadRequest();
            Service? temp = await _dataBaseContext.services.FindAsync(id);
            if(temp == null) return NotFound();
            temp.priceService = updateService.priceService;
            temp.nameService = updateService.nameService;
            temp.timeService = updateService.timeService;
            temp.descriptionService = updateService.descriptionService;
            await _dataBaseContext.SaveChangesAsync();
            return NoContent();

        }


    }
}
