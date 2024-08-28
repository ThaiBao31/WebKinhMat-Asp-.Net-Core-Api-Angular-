
using EyeglassesWeb.DTO;
using EyeglassesWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
public class OrdersController : ControllerBase
{
    private readonly EyeglassesDbContext _context;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(EyeglassesDbContext context, ILogger<OrdersController> logger)
    {
        _context = context;
        _logger = logger;
    }

    private int GetCurrentUserId()
    {
        var userIdClaims = User.FindAll(ClaimTypes.NameIdentifier);
        _logger.LogInformation("Danh sách các claims NameIdentifier: {UserIdClaims}", string.Join(", ", userIdClaims.Select(c => c.Value)));

        var userIdClaim = userIdClaims.FirstOrDefault(c => int.TryParse(c.Value, out _));
        if (userIdClaim == null)
        {
            _logger.LogError("Không tìm thấy claim NameIdentifier hợp lệ.");
            throw new InvalidOperationException("UserId không hợp lệ.");
        }

        _logger.LogInformation("Claim NameIdentifier tìm thấy: {UserIdClaimValue}", userIdClaim.Value);

        if (!int.TryParse(userIdClaim.Value, out int userId))
        {
            _logger.LogError("UserId không phải là số nguyên hợp lệ: {UserIdClaimValue}", userIdClaim.Value);
            throw new InvalidOperationException("UserId không hợp lệ.");
        }

        _logger.LogInformation("UserId đã chuyển đổi thành số nguyên: {UserId}", userId);
        return userId;
    }

    [HttpPost("place-order")]
    public async Task<IActionResult> PlaceOrder([FromBody] OrderDTO orderDTO)
    {
        _logger.LogInformation("Received request to place an order");

        int userId;
        try
        {
            userId = GetCurrentUserId();
        }
        catch (Exception ex)
        {
            _logger.LogWarning("Unauthorized access attempt - {Message}", ex.Message);
            return Unauthorized();
        }

        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            _logger.LogWarning("Cart not found for user {UserId}", userId);
            return NotFound("Giỏ hàng không tồn tại");
        }

        foreach (var cartItem in cart.CartItems)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.ProductId == cartItem.ProductId);

            if (product == null)
            {
                _logger.LogWarning("Product not found with ID {ProductId}", cartItem.ProductId);
                return NotFound($"Sản phẩm với ID {cartItem.ProductId} không tồn tại");
            }

            if (product.Quantity < cartItem.Quantity)
            {
                _logger.LogWarning("Insufficient stock for product ID {ProductId}", cartItem.ProductId);
                return BadRequest($"Số lượng tồn kho không đủ cho sản phẩm {cartItem.ProductId}");
            }
        }

        using (var transaction = await _context.Database.BeginTransactionAsync())
        {
            try
            {
                // Trừ số lượng trong kho và tạo đơn hàng
                foreach (var cartItem in cart.CartItems)
                {
                    var product = await _context.Products.FirstOrDefaultAsync(p => p.ProductId == cartItem.ProductId);

                    // Trừ số lượng trong kho
                    product.Quantity -= cartItem.Quantity;
                }

                var order = new Order
                {
                    UserId = userId,
                    OrderDate = DateTime.UtcNow,
                    TotalAmount = orderDTO.TotalAmount,
                };

                _context.Carts.Remove(cart);
                _context.Orders.Add(order);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                _logger.LogInformation("Order placed successfully for user {UserId}", userId);
                return Ok(new { OrderId = order.OrderId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error placing order for user {UserId}", userId);
                await transaction.RollbackAsync(); 
                return StatusCode(500, "Có lỗi xảy ra khi đặt đơn hàng");
            }
        }
    }







    [HttpPost("update-order-details/{orderId}")]
    public async Task<IActionResult> UpdateOrderDetails(int orderId, [FromBody] List<OrderDetailDTO> orderDetailsDTO)
    {
        _logger.LogInformation("Received request to update order details for order {OrderId}", orderId);

        // Tìm đơn hàng
        var order = await _context.Orders
            .Include(o => o.OrderDetails)
            .FirstOrDefaultAsync(o => o.OrderId == orderId);

        if (order == null)
        {
            _logger.LogWarning("Order not found with ID {OrderId}", orderId);
            return NotFound("Đơn hàng không tồn tại");
        }

        // Kiểm tra và trừ số lượng sản phẩm trong kho
        foreach (var detailDTO in orderDetailsDTO)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.ProductId == detailDTO.ProductId);

            if (product == null)
            {
                _logger.LogWarning("Product not found with ID {ProductId}", detailDTO.ProductId);
                return NotFound($"Sản phẩm với ID {detailDTO.ProductId} không tồn tại");
            }

            if (product.Quantity < detailDTO.Quantity)
            {
                _logger.LogWarning("Insufficient stock for product ID {ProductId}", detailDTO.ProductId);
                return BadRequest($"Số lượng tồn kho không đủ cho sản phẩm {detailDTO.ProductId}");
            }
           
        }

   
        // Cập nhật chi tiết đơn hàng
        order.OrderDetails = orderDetailsDTO.Select(d => new OrderDetail
        {
            OrderId = orderId,
            ProductId = d.ProductId,
            Quantity = d.Quantity,
            Price = d.Price
        }).ToList();

        try
        {
            await _context.SaveChangesAsync();
            _logger.LogInformation("Order details updated and stock reduced successfully for order {OrderId}", orderId);
            return Ok();
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "Error updating order details for order {OrderId}", orderId);
            return StatusCode(500, "Có lỗi xảy ra khi cập nhật chi tiết đơn hàng");
        }
    }

}
