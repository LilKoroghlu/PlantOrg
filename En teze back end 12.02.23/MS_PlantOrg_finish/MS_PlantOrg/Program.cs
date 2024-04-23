

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MS_PlantOrg.Hubs;
using MS_PlantOrg.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddDbContext<PlantOrgContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<PlantOrgContext, PlantOrgContext>();
builder.Services.AddSignalR();
builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");

var devCorsPolicy = "devCorsPolicy";
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        builder =>
        {
            builder.WithOrigins("https://localhost:5500")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .SetIsOriginAllowed((host) => true)
            .AllowCredentials();
        });
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = "MyApp",
        ValidAudience = "MyUsers",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("your-secret-key"))
    };
});

var app = builder.Build();
app.UseAuthentication();
app.UseAuthorization();
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseMiddleware<AuthorizationMiddleware>();


if (app.Environment.IsDevelopment())
{
    app.UseSwaggerUI();
    app.UseCors();
}
else
{
    app.UseHttpsRedirection();
    app.UseAuthorization();
    app.UseCors();
}
app.UseCors(devCorsPolicy);
app.MapControllers();
app.UseRouting();
app.UseOpenApi();
app.UseSwaggerUi3();



app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});
app.MapHub<ChatHub>("/chathub");

app.Run();