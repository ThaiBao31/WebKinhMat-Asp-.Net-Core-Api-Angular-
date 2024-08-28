using EyeglassesWeb.DTO;
using EyeglassesWeb.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Threading.Tasks;

namespace EyeglassesWeb.Controllers;


[ApiController]
[Route("api/[controller]")]
public class ProductImagesController : ControllerBase
{
    private readonly EyeglassesDbContext _context;
    private readonly IWebHostEnvironment _environment;

    public ProductImagesController(EyeglassesDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }


    [HttpPost("upload")]
    public async Task<IActionResult> UploadProductImages([FromForm] ProductImageUploadDTO productImageUploadDTO)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var product = await _context.Products.FindAsync(productImageUploadDTO.ProductId);
            if (product == null)
            {
                return NotFound(new { Message = "Product not found." });
            }

            if (productImageUploadDTO.Images == null || !productImageUploadDTO.Images.Any())
            {
                return BadRequest(new { Message = "No images uploaded." });
            }

            foreach (var formFile in productImageUploadDTO.Images)
            {
                if (formFile.Length > 0)
                {
                    var filePath = Path.Combine(_environment.WebRootPath, "images", formFile.FileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await formFile.CopyToAsync(stream);
                    }

                    var productImage = new ProductImage
                    {
                        ProductId = productImageUploadDTO.ProductId,
                        ImagePath = $"/images/{formFile.FileName}"
                    };

                    _context.ProductImages.Add(productImage);
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { Message = "Images uploaded successfully." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "An error occurred while uploading images.", Details = ex.Message });
        }
    }


    [HttpGet("product/{productId}")]
    public async Task<IActionResult> GetProductImages(int productId)
    {
        try
        {
            var images = await _context.ProductImages
                .Where(pi => pi.ProductId == productId)
                .ToListAsync();

            if (images == null || !images.Any())
            {
                return NotFound(new { Message = "No images found for the specified product." });
            }

            return Ok(images);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "An error occurred while retrieving images.", Details = ex.Message });
        }
    }

    [HttpDelete("delete/{imageId}")]
    public async Task<IActionResult> DeleteProductImage(int imageId)
    {
        try
        {
            var image = await _context.ProductImages.FindAsync(imageId);
            if (image == null)
            {
                return NotFound(new { Message = "Image not found." });
            }

            // Xóa file ảnh từ hệ thống
            var filePath = Path.Combine(_environment.WebRootPath, image.ImagePath.TrimStart('/'));
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }

            _context.ProductImages.Remove(image);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "An error occurred while deleting the image.", Details = ex.Message });
        }
    }
}
