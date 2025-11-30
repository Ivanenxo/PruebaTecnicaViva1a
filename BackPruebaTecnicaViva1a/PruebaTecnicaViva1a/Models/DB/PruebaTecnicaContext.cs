using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using PruebaTecnicaViva1a.Models.DTO;

namespace PruebaTecnicaViva1a.Models.DB;

public partial class PruebaTecnicaContext : DbContext
{
    public PruebaTecnicaContext()
    {
    }

    public PruebaTecnicaContext(DbContextOptions<PruebaTecnicaContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Patient> Patients { get; set; }
    public virtual DbSet<PatientResultDto> PatientsCreatedAfter { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=BAQW10-113414; Database=PruebaTecnica; Trusted_Connection=True; TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Patient>(entity =>
        {
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DocumentNumber)
                .HasMaxLength(20)
                .IsFixedLength();
            entity.Property(e => e.DocumentType)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.Email)
                .HasMaxLength(20)
                .IsFixedLength();
            entity.Property(e => e.FirstName)
                .HasMaxLength(80)
                .IsFixedLength();
            entity.Property(e => e.LastName)
                .HasMaxLength(80)
                .IsFixedLength();
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(20)
                .IsFixedLength();
        });

        modelBuilder.Entity<PatientResultDto>().HasNoKey();

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
