// URL base da API .NET
const API_URL = import.meta.env.VITE_API_URL || '/api';

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.mensagem || (errorData.errors && Object.values(errorData.errors).flat().join(' ')) || errorData.detail || errorData.title || `Erro na requisição: ${response.statusText}`;
    throw new Error(message);
  }
  if (response.status === 204) return null;
  return response.json();
}

// Serviços para Pacientes
export const pacienteService = {
  // GET /api/pacientes (com busca opcional por nome)
  listar: async (nome = '') => {
    const url = nome
      ? `${API_URL}/pacientes?nome=${encodeURIComponent(nome)}`
      : `${API_URL}/pacientes`;
    const res = await fetch(url);
    return handleResponse(res);
  },

  // GET /api/pacientes/:id
  buscarPorId: async (id) => {
    const res = await fetch(`${API_URL}/pacientes/${id}`);
    return handleResponse(res);
  },

  // POST /api/pacientes
  criar: async (dados) => {
    const res = await fetch(`${API_URL}/pacientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
    return handleResponse(res);
  },

  // PUT /api/pacientes/:id
  atualizar: async (id, dados) => {
    const res = await fetch(`${API_URL}/pacientes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
    return handleResponse(res);
  },

  // DELETE /api/pacientes/:id
  excluir: async (id) => {
    const res = await fetch(`${API_URL}/pacientes/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },
};

// Serviços para Atendimentos
export const atendimentoService = {
  // POST /api/atendimentos
  criar: async (dados) => {
    const res = await fetch(`${API_URL}/atendimentos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
    return handleResponse(res);
  },

  // GET /api/atendimentos/:id
  buscarPorId: async (id) => {
    const res = await fetch(`${API_URL}/atendimentos/${id}`);
    return handleResponse(res);
  },

  // GET /api/atendimentos/paciente/:pacienteId
  obterHistoricoPorPaciente: async (pacienteId) => {
    const res = await fetch(`${API_URL}/atendimentos/paciente/${pacienteId}`);
    return handleResponse(res);
  },
};

// Serviços para Óticas
export const opticaService = {
  // GET /api/opticas
  listar: async (nome = '') => {
    const url = nome
      ? `${API_URL}/opticas?nome=${encodeURIComponent(nome)}`
      : `${API_URL}/opticas`;
    const res = await fetch(url);
    return handleResponse(res);
  },

  // GET /api/opticas/:id
  buscarPorId: async (id) => {
    const res = await fetch(`${API_URL}/opticas/${id}`);
    return handleResponse(res);
  },

  // POST /api/opticas
  criar: async (dados) => {
    const res = await fetch(`${API_URL}/opticas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
    return handleResponse(res);
  },

  // PUT /api/opticas/:id
  atualizar: async (id, dados) => {
    const res = await fetch(`${API_URL}/opticas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
    return handleResponse(res);
  },

  // DELETE /api/opticas/:id
  excluir: async (id) => {
    const res = await fetch(`${API_URL}/opticas/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },
};

export const painelService = {
  obter: async ({dias=7,busca='',pagina=1,hoje}) => handleResponse(await fetch(`${API_URL}/painel?${new URLSearchParams({dias,busca,pagina,hoje})}`)),
};
