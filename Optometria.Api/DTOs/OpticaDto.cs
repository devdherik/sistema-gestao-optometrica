namespace Optometria.Api.DTOs;

public class OpticaDto
{
    public int Id {get; set; }
    public string Nome {get; set; } = string.Empty;
    public string? Contato {get; set; }
    public string? Endereco {get; set; }
}