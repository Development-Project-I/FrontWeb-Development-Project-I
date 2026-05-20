# Publicar o GastroPlan em gastroplan.com

Este projeto é um **site estático** (React + Vite). Não precisa de servidor Node em produção — basta gerar a pasta `dist` e hospedar os arquivos.

## Onde hospedar (recomendações)

| Serviço | Por quê | Domínio customizado | Custo inicial |
|--------|---------|---------------------|---------------|
| **[Vercel](https://vercel.com)** (recomendado) | Deploy automático pelo GitHub, HTTPS grátis, fácil | Sim (`gastroplan.com`) | Grátis no plano Hobby |
| **[Cloudflare Pages](https://pages.cloudflare.com)** | Rápido, CDN global, bom com domínio na Cloudflare | Sim | Grátis |
| **[Netlify](https://www.netlify.com)** | Similar à Vercel, arquivo `_redirects` já incluído | Sim | Grátis |

**Domínio `gastroplan.com`:** registre em [Registro.br](https://registro.br), [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) ou outro. A hospedagem e o domínio são contratados separadamente.

---

## Passo a passo (Vercel + domínio)

### 1. Enviar o código para o GitHub

Se ainda não estiver no GitHub:

```bash
git remote -v
git push origin main
```

### 2. Criar projeto na Vercel

1. Acesse [vercel.com](https://vercel.com) e entre com a conta GitHub.
2. **Add New → Project** e importe o repositório `FrontWeb-Development-Project-I`.
3. Configuração (a Vercel costuma detectar sozinha):

   | Campo | Valor |
   |-------|--------|
   | Framework Preset | Vite |
   | Build Command | `yarn build` ou `npm run build` |
   | Output Directory | `dist` |
   | Install Command | `yarn` ou `npm install` |

4. Em **Environment Variables** (opcional, para API futura):

   | Nome | Valor |
   |------|--------|
   | `VITE_APP_NAME` | `GastroPlan` |
   | `VITE_BASE_URL_API` | URL da API quando existir |
   | `VITE_PRIMARY_COLOR` | `#165dfc` |
   | `VITE_SECONDARY_COLOR` | `#eff6ff` |

5. Clique em **Deploy**. Você receberá um link `*.vercel.app`.

### 3. Testar o build localmente (opcional)

```bash
yarn install
yarn build
yarn preview
```

Abra o endereço que o terminal mostrar (geralmente `http://localhost:4173`).

### 4. Conectar o domínio gastroplan.com

**Na Vercel**

1. Projeto → **Settings** → **Domains**.
2. Adicione `gastroplan.com` e `www.gastroplan.com`.
3. A Vercel mostrará os registros DNS necessários (ex.: `A` ou `CNAME`).

**No provedor do domínio** (onde você comprou `gastroplan.com`)

| Tipo | Nome | Valor (exemplo Vercel) |
|------|------|-------------------------|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

Use os valores **exatos** que a Vercel exibir na tela.

Aguarde a propagação DNS (minutos a 48 h). A Vercel emite HTTPS (Let's Encrypt) automaticamente.

### 5. Definir domínio principal

Na Vercel, defina se o site abre em `gastroplan.com` ou `www.gastroplan.com` e configure redirecionamento do outro (recomendado: `www` → raiz ou o contrário, um só canonical).

---

## Alternativa: Cloudflare Pages

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → Connect Git.
2. Build: comando `yarn build`, pasta de saída `dist`.
3. **Custom domains** → adicione `gastroplan.com`.
4. Se o domínio já estiver na Cloudflare, o DNS é configurado quase automaticamente.

O arquivo `public/_redirects` garante que rotas como `/dashboard` funcionem ao atualizar a página (SPA).

---

## O que já está preparado no código

- `vercel.json` — redireciona todas as rotas para `index.html` (React Router).
- `public/_redirects` — mesmo efeito na Netlify e Cloudflare Pages.
- `index.html` — título e meta **GastroPlan**.
- `.env.example` — variáveis `VITE_*` para produção.
- `src/config/env.config.ts` — lê variáveis no build da Vercel.

---

## Checklist antes de apresentar o projeto

- [ ] `yarn build` roda sem erro no seu computador.
- [ ] Login e rotas (`/dashboard`, `/estoque`, etc.) funcionam no link `.vercel.app`.
- [ ] Domínio `gastroplan.com` com cadeado HTTPS no navegador.
- [ ] Atualizar `VITE_BASE_URL_API` quando a API backend existir.

---

## Problemas comuns

**Página em branco após deploy**  
Confira se **Output Directory** é `dist` e se o build terminou com sucesso nos logs.

**404 ao dar F5 em `/planejamento-aulas`**  
Falta rewrite SPA — use `vercel.json` (já no repo) ou `_redirects`.

**Domínio não abre**  
DNS ainda propagando; confira registros no painel do domínio com o que a Vercel/Cloudflare pediu.
