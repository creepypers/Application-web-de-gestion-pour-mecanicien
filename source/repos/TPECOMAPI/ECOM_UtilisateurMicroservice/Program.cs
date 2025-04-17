using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddMvc(config => config.EnableEndpointRouting = false);

builder.Services.AddSwaggerGen(config =>
{
    config.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "User Manager Service - RestAPI",
    });
});

var app = builder.Build();

app.UseMvc();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(config =>
    {
        config.SwaggerEndpoint("/swagger/v1/swagger.json", "User Manager Service - RestAPI V1.0");
    });
}

app.Run();