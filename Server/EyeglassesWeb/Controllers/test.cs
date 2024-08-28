using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace EyeglassesWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class test : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            string[] glasses = { "Kính mát", "Kính cận" };
            return Ok(glasses);
        }
    } 
}
