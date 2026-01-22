using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using TRAQManagement.API.Data;

var builder = WebApplication.CreateBuilder(args);

// ✅ Controllers + JSON Settings (Fix cycle issue)
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true;
    });

// ✅ CORS (Fix Angular calling API)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// ✅ DB Context
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Swagger in dev
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// ✅ IMPORTANT: Use CORS BEFORE Authorization
app.UseCors("AllowAngular");

app.UseAuthorization();

app.MapControllers();

app.Run();
