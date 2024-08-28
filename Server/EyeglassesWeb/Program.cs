using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.IO;
using System.Text;
using EyeglassesWeb.Models;
using EyeglassesWeb.Services;
using Serilog;
using System.Runtime.Serialization;
using Serilog.Formatting.Json;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

// C?u h�nh logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole(); // Ghi log v�o Console
builder.Logging.AddDebug();   // Ghi log v�o Debug Output

// Th�m c�c d?ch v? v�o container.
builder.Services.AddControllers();

builder.Services.AddDbContext<EyeglassesDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// C?u h�nh CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy => policy.WithOrigins("http://localhost:4200")
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// C?u h�nh x�c th?c JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
        NameClaimType = ClaimTypes.NameIdentifier
    };
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var token = context.Request.Headers["Authorization"];
            Console.WriteLine("Nh?n ???c token: " + token);
            return Task.CompletedTask;
        },
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine("Token kh�ng h?p l?: " + context.Exception.Message);
            return Task.CompletedTask;
        }
    };
});



// Th�m c�c d?ch v? v�o container
builder.Services.AddControllersWithViews();

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy =>
        policy.RequireClaim("IsAdmin", "true"));
});

// Th�m Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Eyeglasses API", Version = "v1" });
});

builder.Services.AddHttpLogging(logging =>
{
    logging.LoggingFields = Microsoft.AspNetCore.HttpLogging.HttpLoggingFields.All;
});

builder.Host.UseSerilog((ctx, config) =>
{
    config.WriteTo.Console().MinimumLevel.Information();
    config.WriteTo.File(
        path: AppDomain.CurrentDomain.BaseDirectory + "/logs/log-.txt",
        rollingInterval: RollingInterval.Day,
        rollOnFileSizeLimit: true,
        formatter: new JsonFormatter()).MinimumLevel.Information();
});

// ??ng k� UserService
builder.Services.AddScoped<IUserService, UserService>();

var app = builder.Build();

// C?u h�nh pipeline x? l� y�u c?u HTTP
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

// K�ch ho?t Swagger 
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Eyeglasses API v1");
    });
}

app.UseHttpsRedirection();
app.UseStaticFiles();

// C?u h�nh ?? ph?c v? c�c t?p t?nh t? th? m?c uploads
var uploadsPath = Path.Combine(app.Environment.WebRootPath, "uploads");
if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
}
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});

var imagesPath = Path.Combine(app.Environment.WebRootPath, "images");
if (!Directory.Exists(imagesPath))
{
    Directory.CreateDirectory(imagesPath);
}
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(imagesPath),
    RequestPath = "/images"
});

app.UseRouting();
app.UseCors("AllowAngularApp");
app.UseAuthentication();
app.UseAuthorization();

app.UseSerilogRequestLogging();
app.UseHttpLogging();

app.MapControllers();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// Ph?c v? c�c t?p Angular
app.MapFallbackToFile("index.html");

app.Run();
