using EyeglassesWeb.DTO;
using EyeglassesWeb.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EyeglassesWeb.Controllers
{
    [Authorize(Policy = "AdminOnly")]
    [Route("api/[controller]")]
    [ApiController]
    public class OrderAdminController : ControllerBase
    {
        private readonly EyeglassesDbContext _context;
        private readonly ILogger<CartController> _logger;


        public OrderAdminController(EyeglassesDbContext context, ILogger<CartController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/orderadmin
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderAdminDTO>>> GetOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.User) 
                .Select(o => new OrderAdminDTO
                {
                    OrderId = o.OrderId,
                    UserId = o.UserId,
                    UserName = o.User.FullName,
                    TotalAmount = o.OrderDetails.Sum(od => od.Quantity * od.Price),
                    OrderDate = o.OrderDate,
                    Status = o.Status
                })
                .ToListAsync();

            return Ok(orders);
        }


        [HttpGet("details/{id}")]
        public async Task<ActionResult<IEnumerable<OrderDetailDTO>>> GetOrderDetails(int id)
        {
            var orderDetails = await _context.OrderDetails
                .Where(od => od.OrderId == id)
                .Include(od => od.Product) 
                .Select(od => new OrderDetailDTO
                {
                    ProductId = od.ProductId,
                    ProductName = od.Product.Name,
                    Quantity = od.Quantity,
                    Price = od.Price
                })
                .ToListAsync();

            if (orderDetails == null || !orderDetails.Any())
            {
                return NotFound();
            }

            return Ok(orderDetails);
        }

        [HttpPut("update-status/{id}")]
        public IActionResult UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusDTO updateOrderStatusDto)
        {
            if (!Enum.TryParse(updateOrderStatusDto.Status, out OrderStatus newStatus))
            {
                _logger.LogWarning("Invalid status value provided: {Status}", updateOrderStatusDto.Status);
                return BadRequest(new { message = "Invalid status value provided." });
            }

            var order = _context.Orders.Find(id);
            if (order == null)
            {
                _logger.LogWarning("Order with id {OrderId} not found", id);
                return NotFound();
            }

            _logger.LogInformation("Current status of order id {OrderId} is {CurrentStatus}", id, order.Status);

            order.Status = newStatus;
            _context.SaveChanges();

            _logger.LogInformation("Updated status of order id {OrderId} to {NewStatus}", id, order.Status);

            return Ok(order);
        }




    }
}
