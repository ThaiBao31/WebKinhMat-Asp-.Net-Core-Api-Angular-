using EyeglassesWeb.Models;

namespace EyeglassesWeb.Services
{
    public interface IUserService
    {
        Task<User> AuthenticateAsync(string username, string password);
    }
}
