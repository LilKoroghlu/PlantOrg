using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace MS_PlantOrg.Models
{
    public partial class PlantOrgContext : DbContext
    {
        public PlantOrgContext()
        {
        }

        public PlantOrgContext(DbContextOptions<PlantOrgContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Appeal> Appeals { get; set; } = null!;
        public virtual DbSet<City> Cities { get; set; } = null!;
        public virtual DbSet<Country> Countries { get; set; } = null!;
        public virtual DbSet<Message> Messages { get; set; } = null!;
        public virtual DbSet<OperatorPlant> OperatorPlants { get; set; } = null!;
        public virtual DbSet<OperatorPlantType> OperatorPlantTypes { get; set; } = null!;
        public virtual DbSet<Plant> Plants { get; set; } = null!;
        public virtual DbSet<PlantType> PlantTypes { get; set; } = null!;
        public virtual DbSet<Rating> Ratings { get; set; } = null!;
        public virtual DbSet<Statuse> Statuses { get; set; } = null!;
        public virtual DbSet<User> Users { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Server=ELTUN;Database=PlantOrg;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Appeal>(entity =>
            {
                entity.ToTable("Appeal");

                entity.Property(e => e.AppealDate).HasColumnType("datetime");

                entity.Property(e => e.EndOrNotEnd).HasDefaultValueSql("((0))");

                entity.Property(e => e.PaidOrUnpaid12).HasColumnName("PaidOrUnpaid_1_2");

                entity.HasOne(d => d.AppealPlant)
                    .WithMany(p => p.Appeals)
                    .HasForeignKey(d => d.AppealPlantId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK__Appeal__AppealPl__4E88ABD4");
            });

            modelBuilder.Entity<City>(entity =>
            {
                entity.HasOne(d => d.CityCountry)
                    .WithMany(p => p.Cities)
                    .HasForeignKey(d => d.CityCountryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_City_Country");
            });

            modelBuilder.Entity<Message>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Message1)
                    .HasColumnType("text")
                    .HasColumnName("Message");

                entity.Property(e => e.SendDate).HasColumnType("datetime");

                entity.Property(e => e.Type).HasColumnType("text");
            });

            modelBuilder.Entity<OperatorPlant>(entity =>
            {
                entity.HasKey(e => e.OpId)
                    .HasName("PK__Operator__C7FDFD420BAA310F");

                entity.ToTable("OperatorPlant");

                entity.Property(e => e.OpId).HasColumnName("OP_Id");

                entity.Property(e => e.OpOperatorId).HasColumnName("OP_OperatorId");

                entity.Property(e => e.OpPlantId).HasColumnName("OP_PlantId");
            });

            modelBuilder.Entity<OperatorPlantType>(entity =>
            {
                entity.HasKey(e => e.OptId)
                    .HasName("PK__Operator__140CDAA957AD07AD");

                entity.ToTable("OperatorPlantType");

                entity.Property(e => e.OptId).HasColumnName("OPT_Id");

                entity.Property(e => e.OptOperatorId).HasColumnName("OPT_OperatorId");

                entity.Property(e => e.OptPlanTypetId).HasColumnName("OPT_PlanTypetId");
            });

            modelBuilder.Entity<Plant>(entity =>
            {
                entity.ToTable("Plant");

                entity.Property(e => e.PlantNameEng).IsUnicode(false);

                entity.HasOne(d => d.PlantPlantType)
                    .WithMany(p => p.Plants)
                    .HasForeignKey(d => d.PlantPlantTypeId)
                    .HasConstraintName("FK__Plant__PlantPlan__46E78A0C");
            });

            modelBuilder.Entity<PlantType>(entity =>
            {
                entity.ToTable("PlantType");

                entity.Property(e => e.PlantTypeNameEng).IsUnicode(false);
            });

            modelBuilder.Entity<Rating>(entity =>
            {
                entity.ToTable("Rating");
            });

            modelBuilder.Entity<Statuse>(entity =>
            {
                entity.HasKey(e => e.StatusId)
                    .HasName("PK__Statuse__C8EE2063C7E8719A");

                entity.ToTable("Statuse");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(e => e.UserEmail).IsUnicode(false);

                entity.Property(e => e.UserPassword).IsUnicode(false);

                entity.Property(e => e.UserPhone).IsUnicode(false);

                entity.Property(e => e.UserRegDate).HasColumnType("date");

                entity.HasOne(d => d.UserCity)
                    .WithMany(p => p.Users)
                    .HasForeignKey(d => d.UserCityId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_User_City");

                entity.HasOne(d => d.UserCountry)
                    .WithMany(p => p.Users)
                    .HasForeignKey(d => d.UserCountryId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_User_Country");

                entity.HasOne(d => d.UserStatus)
                    .WithMany(p => p.Users)
                    .HasForeignKey(d => d.UserStatusId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK__Users__UserStatu__403A8C7D");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
