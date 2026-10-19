using System.ComponentModel.DataAnnotations;

namespace Optometria.Api.DTOs;

public class CriarOpticaDto
{
    [Required(ErrorMessage = "O nome da Ótica é obrigatório.")]
    public string Nome {get; set; } = string.Empty;
    public string? Contato {get; set; }
    public string? Endereco {get; set; }
}