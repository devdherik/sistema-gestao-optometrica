using System.ComponentModel.DataAnnotations;

namespace Optometria.Api.DTOs;

public class CriarAtendimentoDto
{
    [Required(ErrorMessage = "O paciente é Obrigatório.")]
    public int PacienteId {get; set; }

    public int? OpticaOrigemId {get; set; }
    public DateTime? DataAtendimento {get; set; }
    
    //queixa e sintomas
    public string? QueixaPrincipal {get; set; }

    //refração ocular
    public RefratometriaOlhoDto? OlhoDireito {get; set; }
    public RefratometriaOlhoDto? OlhoEsquerdo {get; set; }
    public decimal? DistanciaPupilar {get; set; }
    public bool SemNecessidadeNovaCorrecao {get; set; }

    //recomendações e retorno
    public List<String> Lentes {get; set; } = new List<string>();
    public List<String> Tratamentos {get; set; } = new List<string>();
    public DateOnly? DataSugeridaRetorno {get; set; }
    public string? ObservacoesAtendimento {get; set; }

}