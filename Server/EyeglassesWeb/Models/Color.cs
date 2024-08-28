namespace EyeglassesWeb.Models
{
    public class Color
    {
        public int ColorId { get; set; }
        public string Name { get; set; }
        public ICollection<Product> Products { get; set; }
    }
}
