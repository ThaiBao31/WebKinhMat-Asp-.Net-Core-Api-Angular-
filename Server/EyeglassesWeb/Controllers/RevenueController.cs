using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using EyeglassesWeb.Models;
using Microsoft.AspNetCore.Authorization;

namespace EyeglassesWeb.Controllers
{
    [Authorize(Policy = "AdminOnly")]
    [ApiController]
    [Route("api/[controller]")]
    public class RevenueController : ControllerBase
    {
        private readonly EyeglassesDbContext _context;

        public RevenueController(EyeglassesDbContext context)
        {
            _context = context;
        }

        [HttpGet("daily")]
        public async Task<IActionResult> GetDailyRevenue(DateTime date)
        {
            var startDate = date.Date;
            var endDate = startDate.AddDays(1);

            var revenue = await _context.Orders
                .Where(o => o.OrderDate >= startDate && o.OrderDate < endDate &&
                           (o.Status == OrderStatus.Completed || o.Status == OrderStatus.Pending))
                .SumAsync(o => o.TotalAmount);

            return Ok(new { revenue });
        }

        [HttpGet("monthly")]
        public async Task<IActionResult> GetMonthlyRevenue(int month, int year)
        {
            var startDate = new DateTime(year, month, 1);
            var endDate = startDate.AddMonths(1);
            var revenue = await _context.Orders
                .Where(o => o.OrderDate >= startDate && o.OrderDate < endDate &&
                           (o.Status == OrderStatus.Completed || o.Status == OrderStatus.Pending))
                .SumAsync(o => o.TotalAmount);

            return Ok(new { revenue });
        }

        [HttpGet("yearly")]
        public async Task<IActionResult> GetYearlyRevenue(int year)
        {
            var startDate = new DateTime(year, 1, 1);
            var endDate = new DateTime(year + 1, 1, 1);
            var revenue = await _context.Orders
                .Where(o => o.OrderDate >= startDate && o.OrderDate < endDate &&
                           (o.Status == OrderStatus.Completed || o.Status == OrderStatus.Pending))
                .SumAsync(o => o.TotalAmount);

            return Ok(new { revenue });
        }
    }
}
