using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Quizerio.Migrations
{
    /// <inheritdoc />
    public partial class UpdateResult2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "tite",
                table: "Results",
                newName: "QuizTitle");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "QuizTitle",
                table: "Results",
                newName: "tite");
        }
    }
}
