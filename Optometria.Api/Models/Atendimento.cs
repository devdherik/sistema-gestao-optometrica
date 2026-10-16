namespace Optometria.Api.Models;

public class Atendimento
{
    public int Id {get; set; }
    public DateTime? DataAtendimento {get; set; }
    public string? QueixaPrincipal {get; set; }
    public string? ObservacoesAtendimento {get; set; }


    // ligação entre atendimento e paciente
    public int PacienteId {get; set; }
    public Paciente? Paciente {get; set; }

    
    //ligar atendimento a otica
    public int? OpticaOrigemId {get; set; }
    public Optica? OpticaOrigem {get; set;}



    //ligar atendimento à refratimetriaolho
    public RefratometriaOlho? OlhoDireito {get; set; }
    public RefratometriaOlho? OlhoEsquerdo {get; set; }
    public decimal? DistanciaPupilar {get; set; }
    public DateOnly? DataSugeridaRetorno {get; set; }
    public bool SemNecessidadeNovaCorrecao {get; set; }
    

    public List<string> Lentes {get; set; } = new List<string>();
    public List<string> Tratamentos {get; set; } = new List<string>();
    





}