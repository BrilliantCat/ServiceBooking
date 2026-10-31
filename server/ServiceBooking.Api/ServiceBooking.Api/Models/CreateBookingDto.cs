namespace ServiceBooking.Api.Models
{
    public class CreateBookingDto
    {
        public int idClient{get;set;}
        public int idService{get;set;}
        public DateTime startService{get;set;}
    }


}