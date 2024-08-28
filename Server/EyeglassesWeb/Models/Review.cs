using System.ComponentModel.DataAnnotations;

namespace EyeglassesWeb.Models
{
    public class Review
    {
        public int ReviewId { get; set; }

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }

        [Required]
        public string ReviewText { get; set; }

        public DateTime ReviewDate { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }
}
