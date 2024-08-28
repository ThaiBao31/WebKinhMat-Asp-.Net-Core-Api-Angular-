using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EyeglassesWeb.Services;


using EyeglassesWeb.Models;

namespace EyeglassesWeb.Services
{
    public class ProductImageService 
    {
        private readonly EyeglassesDbContext _context;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public ProductImageService(EyeglassesDbContext context, IWebHostEnvironment hostingEnvironment)
        {
            _context = context;
            _hostingEnvironment = hostingEnvironment;
        }

        public async Task<ActionResult> DeleteOldImagesAsync(int productId)
        {
            var images = await _context.ProductImages.Where(p => p.ProductId == productId).ToListAsync();
            if (images == null || !images.Any())
            {
                return new NotFoundObjectResult("No images to delete.");
            }

            foreach (var image in images)
            {
                var filePath = Path.Combine(_hostingEnvironment.WebRootPath, "uploads", image.ImagePath);
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }
                _context.ProductImages.Remove(image);
            }

            await _context.SaveChangesAsync();
            return new OkObjectResult("Old images deleted successfully.");
        }

        public async Task<ActionResult> UploadImagesAsync(int productId, IList<IFormFile> images)
        {
            var uploadDirectory = Path.Combine(_hostingEnvironment.WebRootPath, "uploads");
            if (!Directory.Exists(uploadDirectory))
            {
                Directory.CreateDirectory(uploadDirectory);
            }

            foreach (var image in images)
            {
                var fileName = $"{Guid.NewGuid()}_{image.FileName}";
                var filePath = Path.Combine(uploadDirectory, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                var productImage = new ProductImage
                {
                    ProductId = productId,
                    ImagePath = fileName // Lưu tên tệp vào ImagePath
                };

                _context.ProductImages.Add(productImage);
            }

            await _context.SaveChangesAsync();
            return new OkObjectResult("Images uploaded successfully.");
        }
    }
}
