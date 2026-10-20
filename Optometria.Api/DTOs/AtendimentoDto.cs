namespace Optometria.Api.DTOs;

public class AtendimentoDto
{
    public int Id {get; set; }
    
    public int PacienteId {get; set; }
    public string? NomePaciente {get; set; }

    public int? OpticaOrigemId {get; set; }
    public string? NomeOptica {get; set; }

    public DateTime? DataAtendimento { get; set; }
    public string? QueixaPrincipal { get; set; }

    // Refração ocular
    public RefratometriaOlhoDto? OlhoDireito { get; set; }
    public RefratometriaOlhoDto? OlhoEsquerdo { get; set; }
    public decimal? DistanciaPupilar { get; set; }
    public bool SemNecessidadeNovaCorrecao { get; set; }


    // Recomendações e retorno
    public List<string> Lentes { get; set; } = new List<string>();
    public List<string> Tratamentos { get; set; } = new List<string>();
    public DateOnly? DataSugeridaRetorno { get; set; }
    public string? ObservacoesAtendimento { get; set; }


}