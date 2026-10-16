using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Optometria.Api.Migrations
{
    /// <inheritdoc />
    public partial class AdicionaLentesETratamentos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Lentes",
                table: "Atendimentos",
                type: "TEXT",
                nullable: false,
                defaultValue: "[]");

            migrationBuilder.AddColumn<string>(
                name: "Tratamentos",
                table: "Atendimentos",
                type: "TEXT",
                nullable: false,
                defaultValue: "[]");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Lentes",
                table: "Atendimentos");

            migrationBuilder.DropColumn(
                name: "Tratamentos",
                table: "Atendimentos");
        }
    }
}
