import axios from 'axios';

// Cria a instância do Axios apontando para a URL base do Spring Boot
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
});

// Interceptor de Requisição: Adiciona o Token JWT (se existir) antes de enviar
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('@HelpDesk:token');

    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Interceptor de Resposta: Trata erros de forma centralizada
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Se o backend retornar 401 (Não Autorizado), limpamos o token e forçamos o login
        if (error.response?.status === 401) {
            localStorage.removeItem('@HelpDesk:token');
            localStorage.removeItem('@HelpDesk:user');
            window.location.reload(); // Recarrega a página para derrubar o estado do React
        }

        // Tenta extrair a mensagem de erro do Spring Boot (ProblemDetail ou customizada)
        const backendMessage = error.response?.data?.message
            || error.response?.data?.detail
            || 'Ocorreu um erro inesperado de comunicação com o servidor.';

        // Retorna o erro formatado para o componente que fez a chamada
        return Promise.reject(new Error(backendMessage));
    }
);