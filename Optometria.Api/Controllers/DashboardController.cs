using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Optometria.Api.Data;
using Optometria.Api.DTOs;

namespace Optometria.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly OptometriaDbContext _contexto;

    public DashboardController(OptometriaDbContext contexto)
    {
        _contexto = contexto;
    }

    [HttpGet]
    public async Task<ActionResult<DashboardDto>> ObterResumo()
    {
        var hoje = DateTime.Today;
        var inicioMes = new DateTime(hoje.Year, hoje.Month, 1);

        // 1. Contadores
        var totalPacientes = await _contexto.Pacientes.CountAsync();
        var totalOpticas = await _contexto.Opticas.CountAsync();

        var consultasMes = await _contexto.Atendimentos
            .Where(a => a.DataAtendimento.HasValue && a.DataAtendimento.Value >= inicioMes)
            .CountAsync();

        var consultasHoje = await _contexto.Atendimentos
            .Where(a => a.DataAtendimento.HasValue && a.DataAtendimento.Value.Date == hoje)
            .CountAsync();

        // 2. Últimos 5 atendimentos realizados
        var ultimosAtendimentos = await _contexto.Atendimentos
            .Include(a => a.Paciente)
            .Include(a => a.OpticaOrigem)
            .OrderByDescending(a => a.DataAtendimento)
            .Take(5)
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


        var dashboard = new DashboardDto
        {
            TotalPacientes = totalPacientes,
            TotalOpticas = totalOpticas,
            ConsultasMes = consultasMes,
            ConsultasHoje = consultasHoje,
            UltimosAtendimentos = ultimosAtendimentos,
        };

        return Ok(dashboard);
    }
}
