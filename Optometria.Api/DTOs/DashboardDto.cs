namespace Optometria.Api.DTOs;

public class DashboardDto
{
    public int TotalPacientes { get; set; }
    public int ConsultasMes { get; set; }
    public int ConsultasHoje { get; set; }
    public int TotalOpticas { get; set; }

    public List<AtendimentoDto> UltimosAtendimentos { get; set; } = new List<AtendimentoDto>();
}

