using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Quizerio.Models;
using System.Linq;

namespace Quizerio.Infrastructure.Configurations
{
    public class UserAnswerConfiguration : IEntityTypeConfiguration<UserAnswer>
    {
        public void Configure(EntityTypeBuilder<UserAnswer> builder)
        {
            builder.HasKey(ua => ua.Id);

            builder.Property(ua => ua.ResultId)
                .IsRequired();

            builder.Property(ua => ua.QuestionId)
                .IsRequired();

            builder.Property(ua => ua.UserAnswerText)
                .HasMaxLength(200);

            builder.Property(ua => ua.CorrectAnswerText)
                .HasMaxLength(200);

            builder.Property(ua => ua.IsCorrect)
                .IsRequired();
        }
    }
}
