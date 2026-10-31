using System.ComponentModel.DataAnnotations;

namespace ServiceBooking.Api.Models
{
    public class Client
    {
        [Key]
        public int idClient { get; set; }
        public string nameClient { get; set; } = string.Empty;
        public string emailClient { get; set; } = string.Empty;
        public string phoneClient { get; set; } = string.Empty;
        public string passwordClient { get; set; } = string.Empty;
    }
}
