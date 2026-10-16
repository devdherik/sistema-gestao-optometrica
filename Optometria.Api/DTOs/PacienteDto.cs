namespace Optometria.Api.DTOs;

public class PacienteDto
{
    public int Id {get; set; }
    public string  NomeCompleto {get; set; } = string.Empty;
    public DateOnly? DataNascimento {get; set; }
    public string? Telefone {get; set; }
    public string? Observacoes {get; set; }
}