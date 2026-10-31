using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServiceBooking.Api.Data;
using ServiceBooking.Api.Models;

namespace ServiceBooking.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        public readonly DataBaseContext _dataBaseContext;
        public BookingsController(DataBaseContext dataBaseContext)
        {
            _dataBaseContext = dataBaseContext;
        }
        // Добовляем запись - бронируем
        [HttpPost]
        public async Task<IActionResult> CreateBooking(CreateBookingDto dto)
        {

            var client = await _dataBaseContext.clients.FindAsync(dto.idClient);
            if (client == null) return NotFound("Клиент не найден");

            var service = await _dataBaseContext.services.FindAsync(dto.idService);
            if (service == null) return NotFound("Услуга не найдена");

            var endService = dto.startService.AddMinutes(service.timeService);

            if (endService <= dto.startService) return BadRequest("Время окончания должно быть позже времени начала!");
            
            if(dto.startService < DateTime.UtcNow) return BadRequest("Нельзя бранировать задним числом!");
            
            TimeSpan buffer = TimeSpan.FromMinutes(15);
            var start = dto.startService - buffer;
            var end =  endService + buffer;
            
            if (await _dataBaseContext.bookings.AnyAsync(x =>
               start < x.endService && end > x.startService &&
                x.status != BookingStatus.Cancelled))
                return Conflict("Выбранное время уже занято!");
            var newBooking = new Booking{
                idClient = dto.idClient,
                idService = dto.idService,
                Service = service,
                Client = client,
                startService = dto.startService,
                endService = endService, 
                status = BookingStatus.Created
            };
            
            await _dataBaseContext.bookings.AddAsync(newBooking);
            await _dataBaseContext.SaveChangesAsync();
            return Ok(newBooking);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBookingById(int id){
            Booking? temp = await _dataBaseContext.bookings.FindAsync(id);
            if(temp == null) return NotFound();
            _dataBaseContext.bookings.Remove(temp);
            await _dataBaseContext.SaveChangesAsync();
            return Ok(temp);
        }

 

        // Изменяем статус
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateBookingStatus(int id, [FromBody] BookingStatus newStatus)
        {
            Booking? temp = await _dataBaseContext.bookings.FindAsync(id);
            if (temp == null) return NotFound();
            if (!Enum.IsDefined(typeof(BookingStatus), newStatus)) return BadRequest("Не корректный статус");
            temp.status = newStatus;
            await _dataBaseContext.SaveChangesAsync();
            return Ok(temp);
        }

        [HttpGet]
        public async Task<IActionResult> GetBookings([FromQuery] DateTime? date, 
        [FromQuery] BookingStatus? status,
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 10)
        {
            var query = _dataBaseContext.bookings
            .Include(b => b.Client)
            .Include(b => b.Service)
            .AsNoTracking();
            if (date != null)
            {
                var dayStart = date.Value.Date;
                var dayEnd = dayStart.AddDays(1);
                query = query.Where(b => b.startService >= dayStart && b.startService < dayEnd);
            }
           if (status != null)
                 query = query.Where(b => b.status == status);
            query = query.OrderBy(b => b.startService);
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;
            query = query.Skip((page-1)*pageSize).Take(pageSize);

            return Ok(await query.ToListAsync());
        }
    }
}
