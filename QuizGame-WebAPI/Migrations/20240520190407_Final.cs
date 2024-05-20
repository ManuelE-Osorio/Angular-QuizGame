using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuizGame_WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class Final : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Games_Quizzes_QuizId",
                table: "Games");

            migrationBuilder.AddForeignKey(
                name: "FK_Games_Quizzes_QuizId",
                table: "Games",
                column: "QuizId",
                principalTable: "Quizzes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Games_Quizzes_QuizId",
                table: "Games");

            migrationBuilder.AddForeignKey(
                name: "FK_Games_Quizzes_QuizId",
                table: "Games",
                column: "QuizId",
                principalTable: "Quizzes",
                principalColumn: "Id");
        }
    }
}
