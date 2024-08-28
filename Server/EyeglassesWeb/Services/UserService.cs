using System.Threading.Tasks;
using EyeglassesWeb.Models;
using EyeglassesWeb.Services;
using Microsoft.EntityFrameworkCore;

public class UserService : IUserService
{
    private readonly EyeglassesDbContext _context;

    public UserService(EyeglassesDbContext context)
    {
        _context = context;
    }

    public async Task<User> AuthenticateAsync(string username, string password)
    {
        return await _context.Users.SingleOrDefaultAsync(u => u.Username == username && u.Password == password);
    }
}
