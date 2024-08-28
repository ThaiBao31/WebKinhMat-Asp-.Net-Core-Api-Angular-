namespace EyeglassesWeb.Models
{
    public class Order
    {
        public int OrderId { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public ICollection<OrderDetail> OrderDetails { get; set; }
        public OrderStatus Status { get; set; }
    }
        public enum OrderStatus
        {
            Pending,    
            Completed,  
            Cancelled   
        }

}
