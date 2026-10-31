using Microsoft.EntityFrameworkCore;
using ServiceBooking.Api.Models;

namespace ServiceBooking.Api.Data
{
    public class DataBaseContext : DbContext
    {
        public DbSet<Service> services { get; set; }
        public DbSet<Client> clients { get; set; }
        public DbSet<Booking> bookings { get; set; }
        public DataBaseContext(DbContextOptions<DataBaseContext> options) : base(options) { }
    }
}
