using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Quizerio.DTO;
using Quizerio.Interfaces;
using Quizerio.Models;
using Quizerio.Infrastructure;
using BCrypt.Net;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Quizerio.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        public UserService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            _configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .Build();
        }

        public async Task<IEnumerable<UserDto>> GetAllAsync()
        {
            var users = await _context.Users.ToListAsync();
            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        public async Task<UserDto?> GetByIdAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            return user == null ? null : _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> CreateAsync(UserDto userDto)
        {
            var user = _mapper.Map<User>(userDto);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto?> UpdateAsync(int id, UserDto userDto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return null;

            _mapper.Map(userDto, user);
            await _context.SaveChangesAsync();
            return _mapper.Map<UserDto>(user);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<UserDto> RegisterAsync(RegisterDto dto)
        {
            // Basic validation
            if (dto.Password.Length < 6)
                throw new Exception("Password must be at least 6 characters long.");
            if (!dto.Email.Contains("@"))
                throw new Exception("Invalid email address.");

            // Check for existing username or email
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == dto.Username || u.Email == dto.Email);

            if (existingUser != null)
                throw new Exception("Username or email already exists.");

            // Map DTO to User entity
            var user = _mapper.Map<User>(dto);

            // Set password hash and default role
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            user.Role = "User"; // default role

            // Save to database
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Map saved entity to UserDto and return
            return _mapper.Map<UserDto>(user);
        }


        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _context.Users
                        .FirstOrDefaultAsync(u => u.Username == dto.UsernameOrEmail || u.Email == dto.UsernameOrEmail);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                throw new Exception("Invalid username/email or password");

            // JWT claims
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                claims: claims,
                expires: DateTime.Now.AddDays(2),
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return new AuthResponseDto
            {
                Token = tokenString,
                User = _mapper.Map<UserDto>(user)
            };
        }

    }
}
