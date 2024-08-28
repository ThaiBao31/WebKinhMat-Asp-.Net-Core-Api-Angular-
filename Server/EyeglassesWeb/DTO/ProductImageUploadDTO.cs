namespace EyeglassesWeb.DTO
{
    public class ProductImageUploadDTO
    {
        public int ProductId { get; set; }
        public IEnumerable<IFormFile> Images { get; set; }
    }
}
