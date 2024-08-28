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
    public class OrderStatsController : ControllerBase
    {
        private readonly EyeglassesDbContext _context;

        public OrderStatsController(EyeglassesDbContext context)
        {
            _context = context;
        }

        [HttpGet("daily-stats")]
        public async Task<IActionResult> GetDailyOrderStats(DateTime date)
        {
            var startDate = date.Date;
            var endDate = startDate.AddDays(1);

            var completedOrders = await _context.Orders
                .Where(o => o.OrderDate >= startDate && o.OrderDate < endDate && o.Status == OrderStatus.Completed)
                .CountAsync();

            var pendingOrders = await _context.Orders
                .Where(o => o.OrderDate >= startDate && o.OrderDate < endDate && o.Status == OrderStatus.Pending)
                .CountAsync();

            var cancelledOrders = await _context.Orders
                .Where(o => o.OrderDate >= startDate && o.OrderDate < endDate && o.Status == OrderStatus.Cancelled)
                .CountAsync();

            return Ok(new
            {
                completedOrders,
                pendingOrders,
                cancelledOrders
            });
        }
    }
}
