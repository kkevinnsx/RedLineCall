/**
 * Função para realizar chamadas genéricas à API.
 * @param {string} endpoint - Endpoint da API.
 * @returns {Promise<object>} - Dados retornados pela API.
 */
export const fetchFromAPI = async (endpoint) => {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Erro ao acessar a API: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
      throw error;
    }
  };
  