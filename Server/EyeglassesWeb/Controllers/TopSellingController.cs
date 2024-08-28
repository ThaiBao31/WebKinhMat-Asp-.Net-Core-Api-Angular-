using EyeglassesWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EyeglassesWeb.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class TopSellingController : ControllerBase
    {
        public readonly EyeglassesDbContext _context;
        public TopSellingController(EyeglassesDbContext context)
        {
            _context = context;
        }

        [HttpGet("top-selling-products")]
        public IActionResult GetTopSellingProducts()
        {
            var topSellingProducts = _context.OrderDetails
                .Where(od => od.Order.Status == OrderStatus.Completed)
                .GroupBy(od => od.ProductId)
                .Select(group => new
                {
                    ProductId = group.Key,
                    TotalQuantity = group.Sum(od => od.Quantity)
                })
                .OrderByDescending(x => x.TotalQuantity)
                .Take(5)
                .ToList();

            return Ok(topSellingProducts);
        }

    }
}
