# Bunny video backend (Next.js, read-only)

API intermédia entre o teu app Kobweb e o Bunny Stream.
A API key e a chave do token nunca saem do servidor.

## Endpoints (todos GET)
- `/api/videos?page=&perPage=&search=&collection=` — lista paginada
- `/api/videos/{id}` — detalhe + `playback.embedUrl` assinado
- `/api/collections` — colecções (cursos/módulos)

## Arrancar
1. `npm install`
2. `cp .env.example .env.local` e preenche
3. `npm run dev`  → http://localhost:3000/api/videos
4. Deploy: Vercel (define as mesmas variáveis em Project Settings > Environment Variables)

## Bunny — configuração
Stream > a tua Library > **Security**:
- Activa **Embed view token authentication** e copia a chave → `BUNNY_EMBED_TOKEN_KEY`
- Em **Allowed domains**, adiciona o domínio do teu Kobweb
Stream > Library > **API** → `BUNNY_API_KEY`

## Kobweb
Copia `kobweb-client/*.kt` para `jsMain` e adiciona as dependências Ktor
(`ktor-client-core`, `ktor-client-js`, `ktor-client-content-negotiation`,
`ktor-serialization-kotlinx-json`) + plugin kotlinx-serialization.
