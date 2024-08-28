namespace EyeglassesWeb.Models
{
    public class Gender
    {
        public int GenderId { get; set; }
        public string Name { get; set; }
        public ICollection<Product> Products { get; set; }
    }
}
