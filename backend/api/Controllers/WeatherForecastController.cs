using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Microsoft.Identity.Web.Resource;

namespace api.Controllers
{
    [Authorize]
    [RequiredScope("tasks.read")]
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
                "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
            };

        private readonly ILogger<WeatherForecastController> _logger;
        private readonly Container _container;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, Container container)
        {
            _logger = logger;
            _container = container;
        }

        [HttpGet(Name = "GetWeatherForecast")]
        public IEnumerable<WeatherForecast> Get()
        {
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }

        // productsコンテナにダミーデータを追加するAPI
        [HttpPost("addDummyData")]
        public async Task<IActionResult> AddDummyData()
        {
            var product = new
            {
                id = Guid.NewGuid().ToString(),
                name = "Sample car",
                price = 100,
                description = "This is a sample car.",
                category = "car" // Added partition key category
            };

            await _container.CreateItemAsync(product, new PartitionKey(product.category));
            return Ok("Dummy data added.");
        }
    }
}
