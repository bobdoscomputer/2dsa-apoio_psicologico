# AcolheMente

Aplicativo local para apoio psicológico e gestão de atendimentos.

## Pré-requisitos

1. Node.js (v18+) e npm instalados
2. Na pasta `aap_AcolheMente/src`, execute:

```bash
npm install
npm run dev
```

## Configuração

- Opcionalmente defina `VITE_API_BASE_URL` em `.env.local` para apontar chamadas da API para um backend local ou remoto (padrão: `/api`).

## Observações

- O projeto usa um cliente leve de API (`src/api/appClient.js`) para manter a comunicação com o backend em um padrão REST amigável.
- Se houver um backend, garanta que as rotas correspondam aos endpoints esperados ou adapte o cliente conforme necessário.
