using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Optometria.Api.Data;

namespace Optometria.Api.Controllers;

[ApiController]
[Route("api/painel")]
public class PainelController(OptometriaDbContext contexto) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Obter([FromQuery] DateOnly? hoje, [FromQuery] int dias = 7,
        [FromQuery] string? busca = null, [FromQuery] int pagina = 1)
    {
        if (pagina < 1 || dias is not (0 or 7 or 30 or 90))
            return BadRequest(new { mensagem = "Informe uma página positiva e um período de 0, 7, 30 ou 90 dias." });
        var inicioHoje = (hoje ?? DateOnly.FromDateTime(DateTime.Today)).ToDateTime(TimeOnly.MinValue);
        var amanha = inicioHoje.AddDays(1);
        var meioDia = inicioHoje.AddHours(12);
        var todos = contexto.Atendimentos.AsNoTracking();
        var totalHoje = await todos.CountAsync(a => a.DataAtendimento >= inicioHoje && a.DataAtendimento < amanha);
        var manha = await todos.CountAsync(a => a.DataAtendimento >= inicioHoje && a.DataAtendimento < meioDia);
        var query = todos;
        if (dias > 0) {
            var desde = inicioHoje.AddDays(1 - dias);
            query = query.Where(a => a.DataAtendimento >= desde && a.DataAtendimento < amanha);
        }
        if (!string.IsNullOrWhiteSpace(busca)) {
            var termo = busca.Trim().ToLower();
            query = query.Where(a => a.Paciente != null &&
                ((a.Paciente.NomeCompleto != null && a.Paciente.NomeCompleto.ToLower().Contains(termo)) ||
                 (a.Paciente.Telefone != null && a.Paciente.Telefone.Contains(termo))));
        }
        var total = await query.CountAsync();
        var itens = await query.OrderByDescending(a => a.DataAtendimento).ThenByDescending(a => a.Id)
            .Skip((pagina - 1) * 5).Take(5)
            .Select(a => new {
                a.Id, a.PacienteId, NomePaciente = a.Paciente!.NomeCompleto, Telefone = a.Paciente.Telefone,
                a.DataAtendimento, a.OpticaOrigemId, NomeOptica = a.OpticaOrigem == null ? "Particular" : a.OpticaOrigem.Nome,
                a.OlhoDireito, a.OlhoEsquerdo, a.SemNecessidadeNovaCorrecao
            }).ToListAsync();
        return Ok(new { atendimentosHoje = totalHoje, realizadosManha = manha,
            pacientes = await contexto.Pacientes.CountAsync(), opticas = await contexto.Opticas.CountAsync(),
            total, pagina, itens });
    }
}
