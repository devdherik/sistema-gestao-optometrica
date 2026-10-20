using System.Linq.Expressions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Optometria.Api.Data;
using Optometria.Api.DTOs;
using Optometria.Api.Models;

namespace Optometria.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AtendimentosController : ControllerBase
{
    private readonly OptometriaDbContext _contexto;
    
    public AtendimentosController(OptometriaDbContext contexto)
    {
        _contexto = contexto;
    }



    // POST /api/atendimentos - Registrar nova consulta
    [HttpPost]
    public async Task<ActionResult<AtendimentoDto>> Criar(CriarAtendimentoDto dto)
    {
        //validar se o cliente existe
        var pacienteExiste = await _contexto.Pacientes.AnyAsync(p => p.Id == dto.PacienteId);
        if (!pacienteExiste)
        {
            return BadRequest(new { mensagem = "O paciente informado não existe."});
        }

        // 2. Se informou ótica, validar se ela existe
        if (dto.OpticaOrigemId.HasValue)
        {
            var opticaExiste = await _contexto.Opticas.AnyAsync(o => o.Id == dto.OpticaOrigemId.Value);
            if (!opticaExiste)
            {
                return BadRequest(new { mensagem = "A ótica de origem informada não existe." });
            }
        }

        // 3. montar a entidade do banco
        var atendimento = new Atendimento
        {
            PacienteId = dto.PacienteId,
            OpticaOrigemId = dto.OpticaOrigemId,
            DataAtendimento = dto.DataAtendimento ?? DateTime.Now,
            QueixaPrincipal = dto.QueixaPrincipal,
            DistanciaPupilar = dto.DistanciaPupilar,
            SemNecessidadeNovaCorrecao = dto.SemNecessidadeNovaCorrecao,
            DataSugeridaRetorno = dto.DataSugeridaRetorno,
            ObservacoesAtendimento = dto.ObservacoesAtendimento,
            Lentes = dto.Lentes,
            Tratamentos = dto.Tratamentos
        };

        // 4. Copiar os dados do Olho Direito (se informado)
        if (dto.OlhoDireito != null)
        {
            atendimento.OlhoDireito = new RefratometriaOlho
            {
                Esferico = dto.OlhoDireito.Esferico,
                Cilindrico = dto.OlhoDireito.Cilindrico,
                Eixo = dto.OlhoDireito.Eixo,
                Adicao = dto.OlhoDireito.Adicao,
                AvLonge = dto.OlhoDireito.AvLonge,
                AvPerto = dto.OlhoDireito.AvPerto,
                Dnp = dto.OlhoDireito.Dnp
            };
        }
        // 5. Copiar os dados do Olho Esquerdo (se informado)
        if (dto.OlhoEsquerdo != null)
        {
            atendimento.OlhoEsquerdo = new RefratometriaOlho
            {
                Esferico = dto.OlhoEsquerdo.Esferico,
                Cilindrico = dto.OlhoEsquerdo.Cilindrico,
                Eixo = dto.OlhoEsquerdo.Eixo,
                Adicao = dto.OlhoEsquerdo.Adicao,
                AvLonge = dto.OlhoEsquerdo.AvLonge,
                AvPerto = dto.OlhoEsquerdo.AvPerto,
                Dnp = dto.OlhoEsquerdo.Dnp
            };
        }        

        //salvar no banco
        _contexto.Atendimentos.Add(atendimento);
        await _contexto.SaveChangesAsync();

        //retorna a resposta
        return CreatedAtAction(nameof(BuscarPorId), new { id = atendimento.Id}, new { id = atendimento.Id, mensagem = "Atendimento registrado com sucesso!"});
    }

    // GET /api/atendimentos/{id} - Buscar atendimento pelo ID
    [HttpGet("{id}")]
    public async Task<ActionResult<AtendimentoDto>> BuscarPorId(int id)
    {
        // 1. Busca o atendimento e inclui os dados do Paciente e da Ótica
        var atendimento = await _contexto.Atendimentos
            .Include(a => a.Paciente)
            .Include(a => a.OpticaOrigem)
            .FirstOrDefaultAsync(a => a.Id == id);

        // 2. Se não encontrar, retorna 404
        if (atendimento == null)
        {
            return NotFound(new { mensagem = "Atendimento não encontrado." });
        }

        // 3. Monta o DTO de resposta
        var dto = new AtendimentoDto
        {
            Id = atendimento.Id,
            PacienteId = atendimento.PacienteId,
            NomePaciente = atendimento.Paciente?.NomeCompleto,
            OpticaOrigemId = atendimento.OpticaOrigemId,
            NomeOptica = atendimento.OpticaOrigem?.Nome ?? "Particular",
            DataAtendimento = atendimento.DataAtendimento,
            QueixaPrincipal = atendimento.QueixaPrincipal,
            DistanciaPupilar = atendimento.DistanciaPupilar,
            SemNecessidadeNovaCorrecao = atendimento.SemNecessidadeNovaCorrecao,
            DataSugeridaRetorno = atendimento.DataSugeridaRetorno,
            ObservacoesAtendimento = atendimento.ObservacoesAtendimento,
            Lentes = atendimento.Lentes,
            Tratamentos = atendimento.Tratamentos
        };

        // 4. Copia os olhos para o DTO
        if (atendimento.OlhoDireito != null)
        {
            dto.OlhoDireito = new RefratometriaOlhoDto
            {
                Esferico = atendimento.OlhoDireito.Esferico,
                Cilindrico = atendimento.OlhoDireito.Cilindrico,
                Eixo = atendimento.OlhoDireito.Eixo,
                Adicao = atendimento.OlhoDireito.Adicao,
                AvLonge = atendimento.OlhoDireito.AvLonge,
                AvPerto = atendimento.OlhoDireito.AvPerto,
                Dnp = atendimento.OlhoDireito.Dnp
            };
        }

        if (atendimento.OlhoEsquerdo != null)
        {
            dto.OlhoEsquerdo = new RefratometriaOlhoDto
            {
                Esferico = atendimento.OlhoEsquerdo.Esferico,
                Cilindrico = atendimento.OlhoEsquerdo.Cilindrico,
                Eixo = atendimento.OlhoEsquerdo.Eixo,
                Adicao = atendimento.OlhoEsquerdo.Adicao,
                AvLonge = atendimento.OlhoEsquerdo.AvLonge,
                AvPerto = atendimento.OlhoEsquerdo.AvPerto,
                Dnp = atendimento.OlhoEsquerdo.Dnp
            };
        }

        return Ok(dto);
    }


    // GET /api/atendimentos/paciente/{pacienteId} - Obter histórico de consultas do paciente
    [HttpGet("paciente/{pacienteId}")]
    public async Task<ActionResult<List<AtendimentoDto>>> ObterHistoricoPorPaciente(int pacienteId)
    {
        var atendimentos = await _contexto.Atendimentos
            .Include(a => a.Paciente)
            .Include(a => a.OpticaOrigem)
            .Where(a => a.PacienteId == pacienteId)
            .OrderByDescending(a => a.DataAtendimento)
            .Select(a => new AtendimentoDto
            {
                Id = a.Id,
                PacienteId = a.PacienteId,
                NomePaciente = a.Paciente != null ? a.Paciente.NomeCompleto : null,
                OpticaOrigemId = a.OpticaOrigemId,
                NomeOptica = a.OpticaOrigem != null ? a.OpticaOrigem.Nome : "Particular",
                DataAtendimento = a.DataAtendimento,
                QueixaPrincipal = a.QueixaPrincipal,
                DistanciaPupilar = a.DistanciaPupilar,
                SemNecessidadeNovaCorrecao = a.SemNecessidadeNovaCorrecao,
                DataSugeridaRetorno = a.DataSugeridaRetorno,
                ObservacoesAtendimento = a.ObservacoesAtendimento,
                Lentes = a.Lentes,
                Tratamentos = a.Tratamentos,
                OlhoDireito = a.OlhoDireito != null ? new RefratometriaOlhoDto
                {
                    Esferico = a.OlhoDireito.Esferico,
                    Cilindrico = a.OlhoDireito.Cilindrico,
                    Eixo = a.OlhoDireito.Eixo,
                    Adicao = a.OlhoDireito.Adicao,
                    AvLonge = a.OlhoDireito.AvLonge,
                    AvPerto = a.OlhoDireito.AvPerto,
                    Dnp = a.OlhoDireito.Dnp
                } : null,
                OlhoEsquerdo = a.OlhoEsquerdo != null ? new RefratometriaOlhoDto
                {
                    Esferico = a.OlhoEsquerdo.Esferico,
                    Cilindrico = a.OlhoEsquerdo.Cilindrico,
                    Eixo = a.OlhoEsquerdo.Eixo,
                    Adicao = a.OlhoEsquerdo.Adicao,
                    AvLonge = a.OlhoEsquerdo.AvLonge,
                    AvPerto = a.OlhoEsquerdo.AvPerto,
                    Dnp = a.OlhoEsquerdo.Dnp
                } : null
            })
            .ToListAsync();

            return  Ok(atendimentos);
    } 


}







