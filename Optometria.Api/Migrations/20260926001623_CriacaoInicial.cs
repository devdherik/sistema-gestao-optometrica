using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Optometria.Api.Migrations
{
    /// <inheritdoc />
    public partial class CriacaoInicial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Opticas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nome = table.Column<string>(type: "TEXT", nullable: true),
                    Contato = table.Column<string>(type: "TEXT", nullable: true),
                    Endereco = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Opticas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Pacientes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    NomeCompleto = table.Column<string>(type: "TEXT", nullable: true),
                    DataNascimento = table.Column<DateOnly>(type: "TEXT", nullable: true),
                    Telefone = table.Column<string>(type: "TEXT", nullable: true),
                    Observacoes = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pacientes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Atendimentos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    DataAtendimento = table.Column<DateTime>(type: "TEXT", nullable: true),
                    QueixaPrincipal = table.Column<string>(type: "TEXT", nullable: true),
                    ObservacoesAtendimento = table.Column<string>(type: "TEXT", nullable: true),
                    PacienteId = table.Column<int>(type: "INTEGER", nullable: false),
                    OpticaOrigemId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Atendimentos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Atendimentos_Opticas_OpticaOrigemId",
                        column: x => x.OpticaOrigemId,
                        principalTable: "Opticas",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Atendimentos_Pacientes_PacienteId",
                        column: x => x.PacienteId,
                        principalTable: "Pacientes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Atendimentos_OpticaOrigemId",
                table: "Atendimentos",
                column: "OpticaOrigemId");

            migrationBuilder.CreateIndex(
                name: "IX_Atendimentos_PacienteId",
                table: "Atendimentos",
                column: "PacienteId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Atendimentos");

            migrationBuilder.DropTable(
                name: "Opticas");

            migrationBuilder.DropTable(
                name: "Pacientes");
        }
    }
}
