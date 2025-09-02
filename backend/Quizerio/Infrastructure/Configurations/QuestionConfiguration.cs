using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Quizerio.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Quizerio.Infrastructure.Configurations
{
    public class QuestionConfiguration : IEntityTypeConfiguration<Question>
    {
        public void Configure(EntityTypeBuilder<Question> builder)
        {
            // Primary key
            builder.HasKey(q => q.Id);

            // Polje teksta pitanja
            builder.Property(q => q.Text)
                .IsRequired()
                .HasMaxLength(500);

            // Tip pitanja
            builder.Property(q => q.Type)
                .IsRequired();


            // Opcije (JSON u bazi ako koristiš SQL Server)
            builder.Property(q => q.Options)
                .HasConversion(
                    v => string.Join(";", v),
                    v => v.Split(';', StringSplitOptions.RemoveEmptyEntries).ToList()
                );

            // CorrectOptionIndexes
            builder.Property(q => q.CorrectOptionIndexes)
                .HasConversion(
                    v => string.Join(",", v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(int.Parse).ToList()
                );

            // CorrectAnswerText je običan string, može biti nullable
            builder.Property(q => q.CorrectAnswerText)
                .HasMaxLength(200);

            // Dodaj Points polje
            builder.Property(q => q.Points)
                .IsRequired() // ili ostavi nullable ako želiš
                .HasDefaultValue(1);

            builder.HasOne<Quiz>()
                .WithMany(q => q.Questions)
                .HasForeignKey(q => q.QuizId)
                .OnDelete(DeleteBehavior.Cascade);

        }
    }
}
