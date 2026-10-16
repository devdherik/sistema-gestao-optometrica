using System.ComponentModel.DataAnnotations;

namespace Optometria.Api.DTOs;

public class CriarPacienteDto
{

    [Required(ErrorMessage = "O nome completo do paciente é obrigatório.")]
    public string  NomeCompleto {get; set; } = string.Empty;


    public DateOnly? DataNascimento {get; set; }
    public string? Telefone {get; set; }
    public string? Observacoes {get; set; }
    
}