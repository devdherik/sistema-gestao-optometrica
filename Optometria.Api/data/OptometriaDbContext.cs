using Microsoft.EntityFrameworkCore;
using Optometria.Api.Models;

namespace Optometria.Api.Data;

public class OptometriaDbContext : DbContext
{
    public OptometriaDbContext(DbContextOptions<OptometriaDbContext> options)
        : base(options)
    {
        
    }

    public DbSet<Paciente> Pacientes => Set<Paciente>();
    public DbSet<Atendimento> Atendimentos => Set<Atendimento>();
    public DbSet<Optica> Opticas => Set<Optica>();


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Atendimento>()
            .HasOne(atendimento => atendimento.Paciente)
            .WithMany(paciente => paciente.Atendimentos)
            .HasForeignKey(atendimento => atendimento.PacienteId)
            .OnDelete(DeleteBehavior.Restrict);
    }


}