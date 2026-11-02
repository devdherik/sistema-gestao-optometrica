using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Optometria.Api.Controllers;
using Optometria.Api.Data;
using Optometria.Api.Models;
using System.Text.Json;

using var connection = new SqliteConnection("Data Source=:memory:");
connection.Open();
using var db = new OptometriaDbContext(new DbContextOptionsBuilder<OptometriaDbContext>().UseSqlite(connection).Options);
db.Database.EnsureCreated();
var patients = new PacientesController(db);
var optics = new OpticasController(db);
void Check(bool condition, string name) { if (!condition) throw new Exception(name); Console.WriteLine("PASS: " + name); }
var p = new Paciente { NomeCompleto = "Paciente de teste" };
var o = new Optica { Nome = "Ótica de teste" };
db.AddRange(p,o); db.SaveChanges();
Check(await patients.Exlcuir(p.Id) is NoContentResult, "Paciente sem atendimento pode ser excluído");
Check(!db.Pacientes.AsNoTracking().Any(x=>x.Id==p.Id), "Paciente removido do banco");
Check(await optics.Excluir(o.Id) is NoContentResult, "Ótica sem atendimento pode ser excluída");
db.ChangeTracker.Clear();
Check(await patients.Exlcuir(9999) is NotFoundObjectResult, "Paciente inexistente retorna 404");
Check(await optics.Excluir(9999) is NotFoundObjectResult, "Ótica inexistente retorna 404");
p = new Paciente { NomeCompleto="Histórico preservado" }; o = new Optica { Nome="Origem preservada" }; db.AddRange(p,o); db.SaveChanges();
for(var i=0;i<8;i++) db.Atendimentos.Add(new Atendimento { PacienteId=p.Id, OpticaOrigemId=o.Id, DataAtendimento=DateTime.Today.AddHours(9).AddDays(-i), OlhoDireito=new() { Esferico=0, Adicao=null } });
db.SaveChanges();
Check(await patients.Exlcuir(p.Id) is ConflictObjectResult, "Paciente com histórico retorna 409");
Check(await optics.Excluir(o.Id) is ConflictObjectResult, "Ótica com histórico retorna 409");
Check(db.Atendimentos.Count()==8 && db.Pacientes.Count()==1 && db.Opticas.Count()==1, "Bloqueios preservam todos os registros");
var painel = new PainelController(db);
var result = (OkObjectResult)await painel.Obter(DateOnly.FromDateTime(DateTime.Today),7,null,1);
using var json = JsonDocument.Parse(JsonSerializer.Serialize(result.Value));
Check(json.RootElement.GetProperty("total").GetInt32()==7, "Filtro de sete dias");
Check(json.RootElement.GetProperty("itens").GetArrayLength()==5, "Paginação limita a cinco consultas");
Check(json.RootElement.GetProperty("atendimentosHoje").GetInt32()==1, "Contagem do dia");
var filtered=(OkObjectResult)await painel.Obter(null,0,"inexistente",1);
Check(JsonSerializer.Serialize(filtered.Value).Contains("\"total\":0"), "Busca sem resultados");
Check(await painel.Obter(null,1,null,0) is BadRequestObjectResult, "Parâmetros inválidos retornam 400");
if(args.Length>0) {
 using var demo = new OptometriaDbContext(new DbContextOptionsBuilder<OptometriaDbContext>().UseSqlite($"Data Source={Path.GetFullPath(args[0])}").Options);
 demo.Database.EnsureCreated();
 if(!demo.Pacientes.Any()) {
 var names=new[]{"Mariana Oliveira Santos","Carlos Eduardo Lima","Beatriz Almeida Costa","Roberto Pereira Alves","Luciana Ribeiro Melo"};
 var shops=new[]{new Optica{Nome="Ótica Horizonte",Contato="Ana Souza · (11) 3333-1840",Endereco="Rua das Acácias, 120 • Centro"},new Optica{Nome="Ótica Vista Clara",Contato="Bruno Martins · (11) 3333-2670",Endereco="Av. dos Ipês, 480 • Vila Nova"},new Optica{Nome="Ótica Essencial",Contato="Carla Nunes · (11) 3333-3920",Endereco="Rua das Palmeiras, 85 • Jardim Sul"}};
 demo.AddRange(shops);demo.SaveChanges();
 for(int i=0;i<names.Length;i++) {
 var person=new Paciente{NomeCompleto=names[i],Telefone="(11) 99942-1836",DataNascimento=new DateOnly(1978+i,3,14),Observacoes="Cadastro fictício para validação visual."}; demo.Add(person); demo.SaveChanges();
 demo.Add(new Atendimento{PacienteId=person.Id,OpticaOrigemId=shops[i%3].Id,DataAtendimento=DateTime.Today.AddHours(10).AddMinutes(-i*30),QueixaPrincipal="Dificuldade para leitura de perto e cansaço visual após uso prolongado de telas.",OlhoDireito=new(){Esferico=-1.5m,Cilindrico=-.75m,Eixo=90,Adicao=1.75m,Dnp=31.5m,AvLonge="20/20",AvPerto="J1"},OlhoEsquerdo=new(){Esferico=-1.25m,Cilindrico=-.5m,Eixo=85,Adicao=1.75m,Dnp=31,AvLonge="20/20",AvPerto="J1"},DistanciaPupilar=62.5m,Lentes=["Multifocal"],Tratamentos=["Antirreflexo","Filtro Azul"],DataSugeridaRetorno=DateOnly.FromDateTime(DateTime.Today.AddYears(1)),ObservacoesAtendimento="Orientada sobre adaptação às lentes multifocais."});demo.SaveChanges();
 if(i==0){demo.Add(new Atendimento{PacienteId=person.Id,OpticaOrigemId=shops[0].Id,DataAtendimento=DateTime.Today.AddYears(-1).AddHours(9),OlhoDireito=new(){Esferico=-1.25m,Cilindrico=-.75m,Eixo=90,Adicao=1.5m},OlhoEsquerdo=new(){Esferico=-1,Cilindrico=-.5m,Eixo=85,Adicao=1.5m}});demo.SaveChanges();}
 }
 }
 Console.WriteLine("Banco isolado de validação pronto.");
}
