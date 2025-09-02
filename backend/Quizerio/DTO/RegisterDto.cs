namespace Quizerio.DTO
{
    public class RegisterDto
    {
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!; // čista lozinka, backend će je hashirati
        public string? ImageUrl { get; set; }
    }
}