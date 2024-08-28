namespace EyeglassesWeb.Models
{
    public class Product
    {
        public int ProductId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public decimal PurchasePrice { get; set; }
        public int Quantity { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public int BrandId { get; set; }
        public Brand Brand { get; set; }
        public int ColorId { get; set; }
        public Color Color { get; set; }
        public int GenderId { get; set; }

        public ICollection<ProductImage> ProductImages { get; set; }

        public ICollection<Review> ProductReviews { get; set; }
        public ICollection<OrderDetail> OrderDetails { get; set; } 
        public ICollection<CartItem> CartItems { get; set; }
    }
}
