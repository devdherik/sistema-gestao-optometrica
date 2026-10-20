//url base da api .net

const API_URL = 'http://localhost:5145/api'

// funções pra lidar com pacientes
export const pacienteService = {
    // get /api/pacientes (com busca opicional por nome)
    listar: async (nome = '') => {
        const url = nome ? `${API_URL}/pacientes?nome=${encodeURIComponent(nome)}` : const resposta = await fetch(url);
        if (!resposta.ok) throw
    }
}