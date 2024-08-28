using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EyeglassesWeb.Models;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using EyeglassesWeb.DTO;
using EyeglassesWeb.Services;

namespace EyeglassesWeb.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly EyeglassesDbContext _context;
        private readonly ILogger<CartController> _logger;

        public CartController(EyeglassesDbContext context, ILogger<CartController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddToCart([FromBody] CartItemDTO cartItemDto)
        {
            if (cartItemDto == null || cartItemDto.ProductId <= 0 || cartItemDto.Quantity <= 0)
            {
                return BadRequest("Invalid cart item data.");
            }

            try
            {
                _logger.LogInformation("Adding item to cart: ProductId = {ProductId}, Quantity = {Quantity}", cartItemDto.ProductId, cartItemDto.Quantity);

                int userId = GetCurrentUserId();

                var cart = await _context.Carts
                    .Include(c => c.CartItems)
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                bool isNewCart = false;

                if (cart == null)
                {
                    cart = new Cart
                    {
                        UserId = userId,
                        CartItems = new List<CartItem>()
                    };
                    _context.Carts.Add(cart);
                    await _context.SaveChangesAsync();
                    isNewCart = true;
                }

                var existingItem = cart.CartItems
                    .FirstOrDefault(ci => ci.ProductId == cartItemDto.ProductId);

                if (existingItem != null)
                {
                    existingItem.Quantity += cartItemDto.Quantity;
                }
                else
                {
                    cart.CartItems.Add(new CartItem
                    {
                        ProductId = cartItemDto.ProductId,
                        Quantity = cartItemDto.Quantity
                    });
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    cartId = cart.CartId,
                    isNewCart,
                    productId = cartItemDto.ProductId,
                    quantity = cartItemDto.Quantity
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding item to cart");
                return StatusCode(500, "Internal server error");
            }
        }




        private int GetCurrentUserId()
        {
            // Lấy tất cả claims với loại NameIdentifier
            var userIdClaims = User.FindAll(ClaimTypes.NameIdentifier);

            // Ghi log danh sách tất cả claims
            _logger.LogInformation("Danh sách các claims NameIdentifier: {UserIdClaims}", string.Join(", ", userIdClaims.Select(c => c.Value)));

            // Chọn claim hợp lệ từ danh sách claims
            var userIdClaim = userIdClaims.FirstOrDefault(c => int.TryParse(c.Value, out _));

            if (userIdClaim == null)
            {
                _logger.LogError("Không tìm thấy claim NameIdentifier hợp lệ.");
                throw new InvalidOperationException("UserId không hợp lệ.");
            }

            // Ghi log giá trị của claim
            _logger.LogInformation("Claim NameIdentifier tìm thấy: {UserIdClaimValue}", userIdClaim.Value);

            // Chuyển đổi giá trị claim thành số nguyên
            if (!int.TryParse(userIdClaim.Value, out int userId))
            {
                _logger.LogError("UserId không phải là số nguyên hợp lệ: {UserIdClaimValue}", userIdClaim.Value);
                throw new InvalidOperationException("UserId không hợp lệ.");
            }

            // Ghi log giá trị userId sau khi chuyển đổi
            _logger.LogInformation("UserId đã chuyển đổi thành số nguyên: {UserId}", userId);

            return userId;
        }


        [HttpGet]
        public IActionResult GetCart()
        {
            _logger.LogInformation("Received request to get cart");

            int userId;
            try
            {
                userId = GetCurrentUserId();
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning("Unauthorized access attempt - {Message}", ex.Message);
                return Unauthorized("Token không hợp lệ hoặc không tồn tại.");
            }

            var cart = _context.Carts
                .Where(c => c.UserId == userId)
                .Select(c => new
                {
                    CartId = c.CartId,
                    Items = c.CartItems.Select(ci => new
                    {
                        ProductId = ci.ProductId,
                        ProductName = ci.Product.Name,
                        ProductPrice = ci.Product.Price,
                        Quantity = ci.Quantity,
                        TotalPrice = ci.Quantity * ci.Product.Price,
                        ProductDescription = ci.Product.Description
                    }).ToList()
                })
                .FirstOrDefault();

            if (cart == null)
            {
                _logger.LogWarning("Cart not found for user {UserId}", userId);
                return NotFound("Giỏ hàng không tồn tại");
            }

            _logger.LogInformation("Retrieved cart for user {UserId}", userId);
            return Ok(cart);
        }




        [HttpPut("update")]
        public async Task<IActionResult> UpdateCartItem([FromBody] UpdateCartItemDTO updatedCartItemDto)
        {
            _logger.LogInformation("Received request to update cart item: {UpdatedCartItem}", updatedCartItemDto);

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
                .ThenInclude(ci => ci.Product) // Bao gồm Product
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                _logger.LogWarning("Cart not found for user {UserId}", userId);
                return NotFound("Giỏ hàng không tồn tại");
            }

            var existingItem = cart.CartItems.FirstOrDefault(ci => ci.ProductId == updatedCartItemDto.ProductId);

            if (existingItem == null)
            {
                _logger.LogWarning("Item {ProductId} not found in cart for user {UserId}", updatedCartItemDto.ProductId, userId);
                return NotFound("Sản phẩm không có trong giỏ hàng");
            }

            var product = existingItem.Product; // Sử dụng Product từ existingItem

            if (product == null)
            {
                _logger.LogWarning("Product {ProductId} not found for cart item", updatedCartItemDto.ProductId);
                return NotFound("Sản phẩm không tồn tại");
            }

            if (updatedCartItemDto.Quantity > product.Quantity)
            {
                return BadRequest($"Số lượng yêu cầu không được vượt quá số lượng tồn tại của sản phẩm ({product.Quantity})");
            }

            if (updatedCartItemDto.Quantity <= 0)
            {
                cart.CartItems.Remove(existingItem);
                _logger.LogInformation("Removed item {ProductId} from cart for user {UserId}", updatedCartItemDto.ProductId, userId);
            }
            else
            {
                existingItem.Quantity = updatedCartItemDto.Quantity;
                _logger.LogInformation("Updated item {ProductId} quantity to {Quantity} for user {UserId}", updatedCartItemDto.ProductId, updatedCartItemDto.Quantity, userId);
            }

            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation("Cart updated successfully for user {UserId}", userId);
                return Ok(new
                {
                    CartId = cart.CartId,
                    Items = cart.CartItems.Select(ci => new
                    {
                        ProductId = ci.ProductId,
                        ProductName = ci.Product != null ? ci.Product.Name : "Unknown", // Kiểm tra null
                        ProductPrice = ci.Product != null ? ci.Product.Price : 0, // Kiểm tra null
                        Quantity = ci.Quantity,
                        TotalPrice = ci.Quantity * (ci.Product != null ? ci.Product.Price : 0), // Kiểm tra null
                        ProductDescription = ci.Product != null ? ci.Product.Description : "No description" // Kiểm tra null
                    }).ToList()
                });
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Error updating cart for user {UserId}", userId);
                return StatusCode(500, "Có lỗi xảy ra khi cập nhật giỏ hàng");
            }
        }




        [HttpDelete("remove/{productId}")]
        public async Task<IActionResult> RemoveFromCart(int productId)
        {
            _logger.LogInformation("Received request to remove item {ProductId} from cart", productId);

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

            var cart = _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefault(c => c.UserId == userId);

            if (cart == null)
            {
                _logger.LogWarning("Cart not found for user {UserId}", userId);
                return NotFound("Giỏ hàng không tồn tại");
            }

            var itemToRemove = cart.CartItems.FirstOrDefault(ci => ci.ProductId == productId);

            if (itemToRemove == null)
            {
                _logger.LogWarning("Item {ProductId} not found in cart for user {UserId}", productId, userId);
                return NotFound("Sản phẩm không có trong giỏ hàng");
            }

            cart.CartItems.Remove(itemToRemove);

            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation("Removed item {ProductId} from cart successfully for user {UserId}", productId, userId);
                return Ok(cart);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Error removing item {ProductId} from cart for user {UserId}", productId, userId);
                return StatusCode(500, "Có lỗi xảy ra khi xóa sản phẩm khỏi giỏ hàng");
            }
        }
    }
}
