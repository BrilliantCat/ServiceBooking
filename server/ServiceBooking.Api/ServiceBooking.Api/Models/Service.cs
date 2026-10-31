using System.ComponentModel.DataAnnotations;

namespace ServiceBooking.Api.Models
{
    public class Service
    {
        [Key]
        public int idService { get; set; }
        public string nameService { get; set; } = string.Empty;
        public string descriptionService { get; set; } = string.Empty;
        public decimal priceService { get; set; }
        public int timeService {  get; set; }

    }
}
