using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Quizerio.Models;

namespace Quizerio.Infrastructure.Configurations
{
    public class CompetitionRoomConfiguration : IEntityTypeConfiguration<CompetitionRoom>
    {
        public void Configure(EntityTypeBuilder<CompetitionRoom> builder)
        {
            builder.HasKey(cr => cr.Id);

            builder.Property(cr => cr.Name)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(cr => cr.StartTime)
                .IsRequired();

            builder.Property(cr => cr.CreatedByUserId)
                .IsRequired();

            // Ako ostane bez navigacija, ništa dalje ne treba
        }
    }
}
