using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Quizerio.Models;

namespace Quizerio.Infrastructure.Configurations
{
    public class QuizConfiguration : IEntityTypeConfiguration<Quiz>
    {
        public void Configure(EntityTypeBuilder<Quiz> builder)
        {
            builder.HasKey(q => q.Id);

            builder.Property(q => q.Title)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(q => q.Category)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(q => q.TimeLimit)
                .IsRequired();

            builder.Property(q => q.QuestionsCount)
                .IsRequired();

            builder.Property(q => q.Difficulty)
                .IsRequired()
                .HasConversion<string>() // čuva enum kao string u bazi
                .HasMaxLength(10);

            builder.HasMany(q => q.Questions)
               .WithOne()
               .HasForeignKey(q => q.QuizId)
               .OnDelete(DeleteBehavior.Cascade);

        }
    }
}
