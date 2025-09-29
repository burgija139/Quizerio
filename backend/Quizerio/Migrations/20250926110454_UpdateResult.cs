using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Quizerio.Migrations
{
    /// <inheritdoc />
    public partial class UpdateResult : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "tite",
                table: "Results",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "tite",
                table: "Results");
        }
    }
}
