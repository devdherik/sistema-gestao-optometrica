using Microsoft.AspNetCore.Mvc;
using Optometria.Api.Data;
using Optometria.Api.DTOs;
using Optometria.Api.Models;
using SQLitePCL;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography.X509Certificates;
using System.Diagnostics.CodeAnalysis;

namespace Optometria.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PacientesController : ControllerBase
{
    private readonly OptometriaDbContext _contexto;

    // Contrutor: o .net injeta o banco aqui automaticamente 
    public PacientesController(OptometriaDbContext contexto)
    {
        _contexto = contexto;
    }








    // MÉTODO PARA CRIAR O DTO DO PACIENTE
    [HttpPost]
    public async Task<ActionResult<PacienteDto>> Criar(CriarPacienteDto dto)
    {
        // PRIMEIRA COISA: aqui ele vai criar a entidade no banco a partir dos dados da DTO
        var paciente = new Paciente
        {
            NomeCompleto = dto.NomeCompleto,
            DataNascimento = dto.DataNascimento,
            Telefone = dto.Telefone,
            Observacoes = dto.Observacoes
        };

        // SEGUNDA COISA: aqui ele vai adicionar na tabela e salvar no banco SQLite
        _contexto.Pacientes.Add(paciente);
        await _contexto.SaveChangesAsync();


        // TERCEIRA COISA: aqui eu monto o DTO de resposta com o ID que o banco acabou de gerar
        var resposta = new PacienteDto
        {
            Id = paciente.Id,
            NomeCompleto = paciente.NomeCompleto,
            DataNascimento = paciente.DataNascimento,
            Telefone = paciente.Telefone,
            Observacoes = paciente.Observacoes
        };

        // QUARTA PARTE: retornar o status de criado com sucesso uhul
        return CreatedAtAction(nameof(BuscarPorId), new { id = paciente.Id }, resposta);
    }




    // MÉTODO PARA BUSCAR O PACIENTE PELO ID
    [HttpGet("{id}")]
    public async Task<ActionResult<PacienteDto>> BuscarPorId(int id)
    {
        // busca o paciente no banco pelo id
        var paciente = await _contexto.Pacientes.FindAsync(id);


        // se não encontrar, retorna 404 not found
        if (paciente == null)
        {
            return NotFound(new { mensagem = "Paciente não encontrado."});
        }

        // se encontrou, monta o DTO de resposta
        var dto = new PacienteDto
        {
            Id = paciente.Id,
            NomeCompleto = paciente.NomeCompleto ?? string.Empty,
            DataNascimento = paciente.DataNascimento,
            Telefone = paciente.Telefone,
            Observacoes = paciente.Observacoes
        };

        // retorna 200 OK com os dados do paciente
        return Ok(dto);
    }


    // MÉTODO PARA LISTAR OS PACIENTES
    [HttpGet]
    public async Task<ActionResult<List<PacienteDto>>> Listar([FromQuery] string? nome)
    {
        // preparar a consulta
        var query = _contexto.Pacientes.AsQueryable();

        // se a pessoa digitou algo na busca de nome:
        if (!string.IsNullOrWhiteSpace(nome))
        {
            // aqui eu filtro os pacientes onde o NomeCompleto contenha o texto buscado (ignora se é maiuscula ou minuscula)
            query = query.Where(p => p.NomeCompleto != null && p.NomeCompleto.ToLower().Contains(nome.ToLower()));
        }

        //executa a busca no banco SQLite e já transforam/projeta em PacienteDto
        var pacientes = await query
            .Select(p => new PacienteDto
            {
                Id = p.Id,
                NomeCompleto = p.NomeCompleto ?? string.Empty,
                DataNascimento = p.DataNascimento,
                Telefone = p.Telefone,
                Observacoes = p.Observacoes
            })
            .ToListAsync();

        // aqui eu retorno o 200 OK com a lista de pacientes encontrados
        return Ok(pacientes);
    } 

}
