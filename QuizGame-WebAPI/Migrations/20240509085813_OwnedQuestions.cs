using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuizGame_WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class OwnedQuestions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OwnerId",
                table: "Questions",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Questions_OwnerId",
                table: "Questions",
                column: "OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Questions_AspNetUsers_OwnerId",
                table: "Questions",
                column: "OwnerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Questions_AspNetUsers_OwnerId",
                table: "Questions");

            migrationBuilder.DropIndex(
                name: "IX_Questions_OwnerId",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "Questions");
        }
    }
}
