using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Optometria.Api.Data;
using Optometria.Api.DTOs;
using Optometria.Api.Models;

namespace Optometria.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OpticasController : ControllerBase
{
    private readonly OptometriaDbContext _contexto;

    public OpticasController(OptometriaDbContext contexto)
    {
        _contexto = contexto;
    }

    // POST /api/opticas - Cadastrar nova ótica
    [HttpPost]
    public async Task<ActionResult<OpticaDto>> Criar(CriarOpticaDto dto)
    {
        var optica = new Optica
        {
            Nome = dto.Nome,
            Contato = dto.Contato,
            Endereco = dto.Endereco
        };

        _contexto.Opticas.Add(optica);
        await _contexto.SaveChangesAsync();

        var resposta = new OpticaDto
        {
            Id = optica.Id,
            Nome = optica.Nome ?? string.Empty,
            Contato = optica.Contato,
            Endereco = optica.Endereco
        };

        return CreatedAtAction(nameof(BuscarPorId), new { id = optica.Id }, resposta);
    }

    // GET /api/opticas/{id} - Buscar ótica por ID
    [HttpGet("{id}")]
    public async Task<ActionResult<OpticaDto>> BuscarPorId(int id)
    {
        var optica = await _contexto.Opticas.FindAsync(id);

        if (optica == null)
        {
            return NotFound(new { mensagem = "Ótica não encontrada." });
        }

        var dto = new OpticaDto
        {
            Id = optica.Id,
            Nome = optica.Nome ?? string.Empty,
            Contato = optica.Contato,
            Endereco = optica.Endereco
        };

        return Ok(dto);
    }

    // GET /api/opticas - Listar todas as óticas (com filtro opcional por nome)
    [HttpGet]
    public async Task<ActionResult<List<OpticaDto>>> Listar([FromQuery] string? nome)
    {
        var query = _contexto.Opticas.AsQueryable();

        if (!string.IsNullOrWhiteSpace(nome))
        {
            query = query.Where(o => o.Nome != null && o.Nome.ToLower().Contains(nome.ToLower()));
        }

        var opticas = await query
            .Select(o => new OpticaDto
            {
                Id = o.Id,
                Nome = o.Nome ?? string.Empty,
                Contato = o.Contato,
                Endereco = o.Endereco
            })
            .ToListAsync();

        return Ok(opticas);
    }

    // PUT /api/opticas/{id} - Atualizar dados da ótica
    [HttpPut("{id}")]
    public async Task<ActionResult<OpticaDto>> Atualizar(int id, CriarOpticaDto dto)
    {
        var optica = await _contexto.Opticas.FindAsync(id);

        if (optica == null)
        {
            return NotFound(new { mensagem = "Ótica não encontrada." });
        }

        optica.Nome = dto.Nome;
        optica.Contato = dto.Contato;
        optica.Endereco = dto.Endereco;

        await _contexto.SaveChangesAsync();

        var resposta = new OpticaDto
        {
            Id = optica.Id,
            Nome = optica.Nome ?? string.Empty,
            Contato = optica.Contato,
            Endereco = optica.Endereco
        };

        return Ok(resposta);
    }

    // DELETE /api/opticas/{id} - Excluir ótica
    [HttpDelete("{id}")]
    public async Task<IActionResult> Excluir(int id)
    {
        var optica = await _contexto.Opticas.FindAsync(id);

        if (optica == null)
        {
            return NotFound(new { mensagem = "Ótica não encontrada." });
        }

        var removidos = await _contexto.Opticas
            .Where(o => o.Id == id && !_contexto.Atendimentos.Any(a => a.OpticaOrigemId == o.Id))
            .ExecuteDeleteAsync();
        if (removidos == 0)
            return Conflict(new { mensagem = "Esta ótica possui atendimentos vinculados e não pode ser excluída. A origem dos atendimentos deve ser preservada." });

        return NoContent();
    }
}
