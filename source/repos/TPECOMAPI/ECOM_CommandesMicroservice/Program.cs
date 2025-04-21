using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using ECOM_CommandesMicroservice;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Configure database
string connection_string = "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=master;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False";
string database_name = "ec_order_db";
builder.Services.AddDbContext<OrderDbContext>(options => 
    options.UseSqlServer($"{connection_string};Database={database_name};"));

// Register HttpClient
builder.Services.AddHttpClient();

// Configure JSON serialization
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    })
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });


// Add Swagger
builder.Services.AddSwaggerGen(config =>
{
    config.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Commandes Manager Service - Rest API",
        Version = "v1"
    });
});

var app = builder.Build();

// Apply CORS
app.UseCors();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(config =>
    {
        config.SwaggerEndpoint("/swagger/v1/swagger.json", "Order Manager Service - Rest API V1.0");
    });
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();