using Quizerio.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Quizerio.Mappings;
using Quizerio.Interfaces;
using Quizerio.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Quizerio.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add DbContext.
var connectionString = "Server=DESKTOP-GB38794\\SQLEXPRESS;Database=QuizAppDB;Trusted_Connection=True;TrustServerCertificate=True;";
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

// Add controllers
builder.Services.AddControllers();

// Dodavanje CORS-a
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // ✅ potrebno za SignalR
    });
});

// Add SignalR
builder.Services.AddSignalR();

// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Add custom services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IQuizService, QuizService>();
builder.Services.AddScoped<IResultService, ResultService>();
builder.Services.AddScoped<IArenaService, ArenaService>();

builder.Services.AddHostedService<QuizBackgroundService>();

// Add JWT Authentication
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = false, // uključi ako koristiš audience
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

builder.Services.AddAuthorization(); // potrebno za role-based auth

var app = builder.Build();

// Configure HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

// ✅ CORS mora da ide pre Auth middlewara
app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Mapiranje SignalR huba
app.MapHub<ArenaHub>("/arenaHub");

app.Run();

// Add CORS 

builder.Services.AddCors(options => 

{ 

    options.AddPolicy("AllowReactApp", policy => 

    { 

        policy.WithOrigins("http://localhost:3000") 

              .AllowAnyHeader() 

              .AllowAnyMethod() 

              .AllowCredentials(); // Potrebno za SignalR 

    }); 

}); 

  

// Add SignalR 

builder.Services.AddSignalR(); 

  

// Add Swagger 

builder.Services.AddEndpointsApiExplorer(); 

builder.Services.AddSwaggerGen(); 

  

// Add AutoMapper 

builder.Services.AddAutoMapper(typeof(MappingProfile)); 

  

// Add JWT Authentication 

builder.Services.AddAuthentication("Bearer") 

    .AddJwtBearer("Bearer", options => 

    { 

        options.TokenValidationParameters = new TokenValidationParameters 

        { 

            ValidateIssuer = true, 

            ValidateAudience = false, // Uključi ako koristiš audience 

            ValidateLifetime = true, 

            ValidateIssuerSigningKey = true, 

            ValidIssuer = builder.Configuration["Jwt:Issuer"], 

            IssuerSigningKey = new SymmetricSecurityKey( 

                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])) 

        }; 

    }); 