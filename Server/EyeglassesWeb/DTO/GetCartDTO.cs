namespace EyeglassesWeb.DTO
{
    public class GetCartDTO
    {
            public int ProductId { get; set; }
            public string ProductName { get; set; }
            public decimal ProductPrice { get; set; }
            public int Quantity { get; set; }
            public decimal TotalPrice {  get; set; }
            public string ProductDescription { get; set; }


    }
}
