namespace EyeglassesWeb.Models
{
    public class Brand
    {
        public int BrandId { get; set; }
        public string Name { get; set; }
        public ICollection<Product> Products { get; set; }
    }
}
