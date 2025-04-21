using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ECOM_UtilisateurMicroservice.Services;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Add HttpClient and DummyJsonService
builder.Services.AddHttpClient<DummyJsonService>();
builder.Services.AddScoped<DummyJsonService>();
builder.Services.AddScoped<DbInitializer>();

// Add DbContext
builder.Services.AddDbContext<ECOM_UtilisateurMicroservice.UtilisateurDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));



// Add Swagger
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Seed the database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try 
    {
        var dbInitializer = services.GetRequiredService<DbInitializer>();
        await dbInitializer.InitializeDatabaseAsync();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable CORS

app.UseHttpsRedirection();
app.UseAuthentication();  // Add this before UseAuthorization
app.UseAuthorization();

app.MapControllers();

app.Run();