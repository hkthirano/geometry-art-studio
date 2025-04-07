using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Azure.Cosmos;
using Microsoft.Identity.Web;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAdB2C"));
builder.Services.Configure<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme, options =>
{
    options.TokenValidationParameters.NameClaimType = "name";
});

// Cosmos DB
var cosmosEndpoint = builder.Configuration.GetSection("CosmosEndpoint").Value;
var cosmosKey = builder.Configuration.GetSection("CosmosKey").Value;
var databaseName = "cosmicworks";
builder.Services.AddSingleton<CosmosClient>(sp => new CosmosClient(cosmosEndpoint, cosmosKey));
builder.Services.AddSingleton(sp =>
{
    var cosmosClient = sp.GetRequiredService<CosmosClient>();
    return cosmosClient.GetContainer(databaseName, "products");
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
