namespace Quizerio.Models
{
    public class User
    {
        public int Id { get; set; } // Auto-increment primary key
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty; // hashed lozinka
        public string Role { get; set; } = "User"; // default = User ili Admin
    }
}
