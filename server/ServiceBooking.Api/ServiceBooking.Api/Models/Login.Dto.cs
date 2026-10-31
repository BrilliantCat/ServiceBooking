namespace ServiceBooking.Api.Models;

public class LoginDto{
    public required string phoneClient { get; set; } = string.Empty;
    public required string passwordClient { get; set; } = string.Empty;
}