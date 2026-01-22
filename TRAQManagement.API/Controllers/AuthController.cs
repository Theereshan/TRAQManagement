using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TRAQManagement.API.Data;
using TRAQManagement.API.Models;

namespace TRAQManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user == null)
                return Unauthorized("Invalid username or password");

            // simple password check (for assessment)
            if (user.PasswordHash != request.Password)
                return Unauthorized("Invalid username or password");

            return Ok(new { message = "Login successful", username = user.Username });
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; } = "";
        public string Password { get; set; } = "";
    }
}
