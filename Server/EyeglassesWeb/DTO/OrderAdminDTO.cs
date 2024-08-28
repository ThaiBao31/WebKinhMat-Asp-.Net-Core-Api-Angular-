using EyeglassesWeb.Models;

namespace EyeglassesWeb.DTO
{
    public class OrderAdminDTO
    {
   
            public int UserId { get; set; }
            public int OrderId { get; set; }
            public string UserName { get; set; }
            public decimal TotalAmount { get; set; }
            public DateTime OrderDate { get; set; }
            public OrderStatus Status { get; set; }

    }

}

