using EyeglassesWeb.DTO;
using EyeglassesWeb.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EyeglassesWeb.Controllers;

[Authorize(Policy = "AdminOnly")]
[ApiController]
[Route("api/[controller]")]
public class ProductAdminController : ControllerBase
{
    private readonly EyeglassesDbContext _context;

    public ProductAdminController(EyeglassesDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetAllProducts()
    {
        return Ok(await _context.Products.ToListAsync());
    }
    [HttpGet("product/{productId}/avatar")]
    public async Task<IActionResult> GetProductAvatar(int productId)
    {
        try
        {
            var image = await _context.ProductImages
                .Where(pi => pi.ProductId == productId)
                .OrderBy(pi => pi.ProductImageId)
                .FirstOrDefaultAsync();

            if (image == null)
            {
                return NotFound(new { Message = "No avatar image found for the specified product." });
            }

            return Ok(new { ImageUrl = image.ImagePath });
        }
        catch (Exception ex)
        {

            return StatusCode(500, new { Message = "An error occurred while retrieving the product avatar.", Details = ex.Message });
        }
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProductById(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound();
        }
        return Ok(product);
    }

    [HttpPost]
    public async Task<ActionResult<Product>> AddProduct([FromBody] ProductDTO productDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var product = new Product
        {
            Name = productDto.Name,
            Description = productDto.Description,
            Price = productDto.Price,
            PurchasePrice = productDto.PurchasePrice,
            Quantity = productDto.Quantity,
            CategoryId = productDto.CategoryId,
            BrandId = productDto.BrandId,
            ColorId = productDto.ColorId,
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProductById), new { id = product.ProductId }, product);
    }



    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductUpdateDTO productDto)
    {
        if (id != productDto.ProductId || !ModelState.IsValid)
        {
            return BadRequest();
        }

        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound();
        }

        product.Name = productDto.Name;
        product.Description = productDto.Description;
        product.Price = productDto.Price;
        product.PurchasePrice = productDto.PurchasePrice;
        product.Quantity = productDto.Quantity;
        product.CategoryId = productDto.CategoryId;
        product.BrandId = productDto.BrandId;
        product.ColorId = productDto.ColorId;


        _context.Entry(product).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ProductExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound();
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ProductExists(int id)
    {
        return _context.Products.Any(e => e.ProductId == id);
    }
}
