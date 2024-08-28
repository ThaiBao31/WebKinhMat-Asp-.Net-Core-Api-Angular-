using EyeglassesWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace EyeglassesWeb.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilterController : Controller
    {
        private readonly EyeglassesDbContext _context;

        public FilterController(EyeglassesDbContext context)
        {
            _context = context;
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Categories.ToListAsync();
            return Ok(categories);
        }

        [HttpGet("brands")]
        public async Task<IActionResult> GetBrands()
        {
            var brands = await _context.Brands.ToListAsync();
            return Ok(brands);
        }

        [HttpGet("colors")]
        public async Task<IActionResult> GetColors()
        {
            var colors = await _context.Colors.ToListAsync();
            return Ok(colors);
        }


        [HttpGet("products")]
        public async Task<IActionResult> FilterProducts([FromQuery] int[] categoryIds, [FromQuery] int[] brandIds, [FromQuery] int[] colorIds)
        {
            var query = _context.Products.AsQueryable();

            if (categoryIds.Length > 0)
            {
                query = query.Where(p => categoryIds.Contains(p.CategoryId));
            }

            if (brandIds.Length > 0)
            {
                query = query.Where(p => brandIds.Contains(p.BrandId));
            }

            if (colorIds.Length > 0)
            {
                query = query.Where(p => colorIds.Contains(p.ColorId));
            }

            var filteredProducts = await query.ToListAsync();

            return Ok(filteredProducts);
        }
    }
}
