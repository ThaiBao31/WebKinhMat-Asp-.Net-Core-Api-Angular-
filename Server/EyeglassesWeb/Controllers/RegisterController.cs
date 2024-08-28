using EyeglassesWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class RegisterController : ControllerBase
{
    private readonly EyeglassesDbContext _context;

    public RegisterController(EyeglassesDbContext context)
    {
        _context = context;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (await _context.Users.AnyAsync(u => u.Username == model.Username || u.Email == model.Email))
        {
            return BadRequest("Tên đăng nhập hoặc email đã được sử dụng.");
        }

        var user = new User
        {
            FullName = model.FullName,
            Username = model.Username,
            Password = model.Password,
            Email = model.Email,
            PhoneNumber = model.PhoneNumber,
            Address = model.Address, 
            IsAdmin = false
        };


        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        if (await _context.Users.AnyAsync(u => u.Username == model.Username))
        {
            return Ok(new { message = "Đăng ký thành công" });
        }

        return StatusCode(500, "Có lỗi xảy ra khi đăng ký người dùng.");
    }
}

public class RegisterModel
{
    public string FullName { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string Address { get; set; }
    public bool Confirm { get; set; }
}
