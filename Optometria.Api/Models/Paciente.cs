namespace Optometria.Api.Models;

public class Paciente
{
    public int Id {get; set; }

    // o "?" indica que o valor pode ficar vazio
    public string?  NomeCompleto {get; set; }
    public DateOnly? DataNascimento {get; set; }
    public string? Telefone {get; set; }
    public string? Observacoes {get; set; }

}