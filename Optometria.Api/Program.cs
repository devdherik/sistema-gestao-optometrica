using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Optometria.Api.Data;



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var conexao = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<OptometriaDbContext>(options =>
    options.UseSqlite(conexao));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirFrontEnd", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // a porta do vite
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});








var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();

app.UseCors("PermitirFrontEnd");

app.UseAuthorization();

app.MapControllers();

app.Run();
