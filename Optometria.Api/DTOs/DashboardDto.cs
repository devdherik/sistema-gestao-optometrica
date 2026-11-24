namespace Optometria.Api.DTOs;

public class DashboardDto
{
    public int TotalPacientes { get; set; }
    public int ConsultasMes { get; set; }
    public int ConsultasHoje { get; set; }
    public int TotalOpticas { get; set; }

    public List<AtendimentoDto> UltimosAtendimentos { get; set; } = new List<AtendimentoDto>();
    public List<RetornoSugeridoDto> ProximosRetornos { get; set; } = new List<RetornoSugeridoDto>();
}

public class RetornoSugeridoDto
{
    public int PacienteId { get; set; }
    public string NomePaciente { get; set; } = string.Empty;
    public string? Telefone { get; set; }
    public DateOnly? DataSugeridaRetorno { get; set; }
    public DateTime? UltimaConsulta { get; set; }
    public string? StatusRetorno { get; set; } // "Vencido", "Este Mês", "Próximo"
}
