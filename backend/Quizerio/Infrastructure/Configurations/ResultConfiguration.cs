using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Quizerio.Models;

namespace Quizerio.Infrastructure.Configurations
{
    public class ResultConfiguration : IEntityTypeConfiguration<Result>
    {
        public void Configure(EntityTypeBuilder<Result> builder)
        {
            builder.HasKey(r => r.Id);

            builder.Property(r => r.UserId)
                .IsRequired();

            builder.Property(r => r.QuizId)
                .IsRequired();

            builder.Property(r => r.Score)
                .IsRequired();

            builder.Property(r => r.TakenAt)
                .IsRequired();

            // Relacija Result -> UserAnswer
            builder.HasMany(r => r.Answers)
                .WithOne()
                .HasForeignKey(ua => ua.ResultId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
