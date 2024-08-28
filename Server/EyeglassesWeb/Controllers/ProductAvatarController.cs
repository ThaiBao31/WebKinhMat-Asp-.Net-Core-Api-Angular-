using EyeglassesWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace EyeglassesWeb.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductAvatarController : ControllerBase
    {
        private readonly EyeglassesDbContext _context;

        public ProductAvatarController(EyeglassesDbContext context)
        {
            _context = context;
        }

        [HttpGet("product/{productId}/avatar")]
        public async Task<IActionResult> GetProductAvatar(int productId)
        {
            // Tìm sản phẩm trong cơ sở dữ liệu
            var product = await _context.Products
                .Include(p => p.ProductImages) 
                .FirstOrDefaultAsync(p => p.ProductId == productId);

            if (product == null)
            {
                return NotFound(new { Message = "Product not found." });
            }

            // Lấy ảnh đầu tiên
            var avatarImage = product.ProductImages?.FirstOrDefault();
            if (avatarImage == null)
            {
                return NotFound(new { Message = "No images found for the specified product." });
            }

            // Trả về đường dẫn tới ảnh
            return Ok(new { imageUrl = avatarImage.ImagePath });
        }
    }
}
