using EyeglassesWeb.Models;
using EyeglassesWeb.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class LoginController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly IUserService _userService;
    private readonly ILogger<LoginController> _logger;
    private readonly EyeglassesDbContext _context;

    public LoginController(IConfiguration configuration, IUserService userService, ILogger<LoginController> logger,EyeglassesDbContext eyeglassesDbContext)
    {
        _configuration = configuration;
        _userService = userService;
        _logger = logger;
        _context = eyeglassesDbContext;
    }


    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel login)
    {

        var user = await _userService.AuthenticateAsync(login.Username, login.Password);

        if (user == null)
        {
            return Unauthorized();
        }


        var token = GenerateJwtToken(user);


        var cart = await _context.Carts
            .FirstOrDefaultAsync(c => c.UserId == user.UserId);

        if (cart == null)
        {
            cart = new Cart
            {
                UserId = user.UserId,
                CartItems = new List<CartItem>()
            };
            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();
        }

        return Ok(new { Token = token, CartId = cart.CartId });
    }

    private string GenerateJwtToken(User user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
  {
    new Claim(JwtRegisteredClaimNames.Sub, user.Username), 
    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()), 
     new Claim("IsAdmin", user.IsAdmin.ToString().ToLower())
};


        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(30),
            signingCredentials: credentials);

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(tokenString);
        foreach (var claim in jwtToken.Claims)
        {
            _logger.LogInformation($"Claim Type: {claim.Type}, Claim Value: {claim.Value}");
        }

        return tokenString;
    }




}

public class LoginModel
{
    public string Username { get; set; }
    public string Password { get; set; }
}
