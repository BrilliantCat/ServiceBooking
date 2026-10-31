using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServiceBooking.Api.Models
{
    public enum BookingStatus { Created,Confirmed,Cancelled}
    public class Booking
    {
        [Key]
        public int idBooking { get; set; }
        [ForeignKey("Client")]
        public int idClient {  get; set; }
        public Client? Client { get; set; }

        [ForeignKey("Service")]
        public int idService {  get; set; }
        public Service? Service { get; set; }

        public DateTime startService { get; set; }
        public DateTime endService { get; set; }

        public BookingStatus status { get; set; }

    }
}
