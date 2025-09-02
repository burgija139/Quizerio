namespace Quizerio.DTO
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string ImageUrl { get; set; } = string.Empty; // URL slike profila
        public string Role { get; set; } = "User"; // Default role is User, can be Admin
    }
}
