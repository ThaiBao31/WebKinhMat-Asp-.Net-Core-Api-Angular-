namespace EyeglassesWeb.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public bool IsAdmin { get; set; }

        public ICollection<Review> ProductReviews { get; set; }
        public ICollection<Order> Orders { get; set; }

        public ICollection<Cart> Carts { get; set; }
    }
}
