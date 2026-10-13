using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Optometria.Api.Migrations
{
    /// <inheritdoc />
    public partial class AdicionaRefratometriaAoAtendimento : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "DataSugeridaRetorno",
                table: "Atendimentos",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "DistanciaPupilar",
                table: "Atendimentos",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "OlhoDireito_Adicao",
                table: "Atendimentos",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OlhoDireito_AvLonge",
                table: "Atendimentos",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OlhoDireito_AvPerto",
                table: "Atendimentos",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "OlhoDireito_Cilindrico",
                table: "Atendimentos",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "OlhoDireito_Dnp",
                table: "Atendimentos",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "OlhoDireito_Eixo",
                table: "Atendimentos",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "OlhoDireito_Esferico",
                table: "Atendimentos",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "OlhoEsquerdo_Adicao",
                table: "Atendimentos",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OlhoEsquerdo_AvLonge",
                table: "Atendimentos",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OlhoEsquerdo_AvPerto",
                table: "Atendimentos",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "OlhoEsquerdo_Cilindrico",
                table: "Atendimentos",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "OlhoEsquerdo_Dnp",
                table: "Atendimentos",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "OlhoEsquerdo_Eixo",
                table: "Atendimentos",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "OlhoEsquerdo_Esferico",
                table: "Atendimentos",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "SemNecessidadeNovaCorrecao",
                table: "Atendimentos",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DataSugeridaRetorno",
                table: "Atendimentos");

            migrationBuilder.DropColumn(
                name: "DistanciaPupilar",
                table: "Atendimentos");

            migrationBuilder.DropColumn(
                name: "OlhoDireito_Adicao",
                table: "Atendimentos");

            migrationBuilder.DropColumn(
                name: "OlhoDireito_AvLonge",
                table: "Atendimentos");

            migrationBuilder.DropColumn(
                name: "OlhoDireito_AvPerto",
                table: "Atendimentos");

            migrationBuilder.DropColumn(
                name: "OlhoDireito_Cilindrico",
                table: "Atendimentos");

            migrationBuilder.DropColumn(
                name: "OlhoDireito_Dnp",
                table: "Atendimentos");

            migrationBuilder.DropColumn(
                name: "OlhoDireito_Eixo",
                table: "Atendimentos");

            migrationBuilder.DropColumn(
                name: "OlhoDireito_Esferico",
                table: "Atendimentos");

            migrationBuilder.DropColumn(
                name: "OlhoEsquerdo_Adicao",
                table: "Atendimentos");

            migrationBuilder.DropColumn(
                name: "OlhoEsquerdo_AvLonge",
                table: "Atendimentos");

            migrationBuilder.DropColumn(
                name: "OlhoEsquerdo_AvPerto",
                table: "Atendimentos");

            migrationBuilder.DropColumn(
                name: "OlhoEsquerdo_Cilindrico",
                table: "Atendimentos");

            migrationBuilder.DropColumn(
                name: "OlhoEsquerdo_Dnp",
                table: "Atendimentos");

            migrationBuilder.DropColumn(
                name: "OlhoEsquerdo_Eixo",
                table: "Atendimentos");

            migrationBuilder.DropColumn(
                name: "OlhoEsquerdo_Esferico",
                table: "Atendimentos");

            migrationBuilder.DropColumn(
                name: "SemNecessidadeNovaCorrecao",
                table: "Atendimentos");
        }
    }
}
