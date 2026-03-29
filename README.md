# ⚔️ StudyQuest

> **Transforme seus estudos em uma aventura RPG.** Ganhe XP, suba de nível, mantenha streaks e desbloqueie conquistas enquanto aprende.

🌐 **[Acesse o projeto ao vivo](https://studyquest-rho.vercel.app)**

---

## 📸 Preview

> Dashboard com sistema de XP, tarefas por dificuldade e conquistas desbloqueáveis.

---

## 🚀 Funcionalidades

- **Sistema de XP e Níveis** — cada tarefa concluída recompensa XP baseado na dificuldade
- **Dificuldades** — Fácil (25 XP), Médio (50 XP), Difícil (100 XP) e Lendário (200 XP)
- **Classes de Personagem** — Sábio, Executor, Guerreiro, Mago e Explorador, cada um com bônus de XP único
- **Sistema de Streak** — mantenha sequências diárias de estudo e acumule bônus
- **Conquistas** — desbloqueie badges ao atingir metas como completar tarefas, manter streaks e acumular XP
- **Ranking** — veja sua posição entre todos os usuários
- **Perfil editável** — altere nome, email, senha e classe do personagem
- **Notificações inteligentes** — avisos sobre streaks em risco, conquistas próximas e bônus de classe
- **Autenticação segura** — JWT com rate limiting e senhas fortes obrigatórias

---

## 🛠️ Tecnologias

### Frontend
- [Next.js 14](https://nextjs.org/) — framework React com App Router
- [TypeScript](https://www.typescriptlang.org/) — tipagem estática
- [Tailwind CSS](https://tailwindcss.com/) — estilização
- [Recharts](https://recharts.org/) — gráficos de progresso
- [Lucide React](https://lucide.dev/) — ícones

### Backend
- [FastAPI](https://fastapi.tiangolo.com/) — framework Python moderno e rápido
- [SQLAlchemy](https://www.sqlalchemy.org/) — ORM
- [PostgreSQL](https://www.postgresql.org/) — banco de dados
- [JWT](https://jwt.io/) — autenticação
- [SlowAPI](https://github.com/laurentS/slowapi) — rate limiting
- [Bcrypt](https://pypi.org/project/bcrypt/) — hash de senhas

### Infraestrutura
- [Vercel](https://vercel.com/) — deploy do frontend
- [Render](https://render.com/) — deploy do backend
- [Supabase](https://supabase.com/) — banco de dados PostgreSQL em produção
- [Docker](https://www.docker.com/) — containerização para desenvolvimento local

---

## 📁 Estrutura do Projeto

```
studyquest/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py
│       ├── core/          # config, database, security
│       ├── models/        # SQLAlchemy models
│       ├── schemas/       # Pydantic schemas
│       ├── routers/       # endpoints da API
│       └── services/      # lógica de negócio
└── frontend/
    ├── Dockerfile
    ├── package.json
    └── src/
        ├── app/           # páginas Next.js
        ├── components/    # componentes React
        ├── lib/           # api client, auth context
        └── types/         # TypeScript types
```

---

## ⚙️ Como rodar localmente

### Pré-requisitos
- [Docker](https://www.docker.com/) e Docker Compose instalados

### Passo a passo

```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/studyquest.git
cd studyquest

# Crie o arquivo de variáveis de ambiente
cp backend/.env.example backend/.env
# Edite o backend/.env com suas configurações

# Suba os containers
docker-compose up --build
```

Acesse:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Swagger Docs:** http://localhost:8000/docs (apenas em desenvolvimento)

---

## 🔑 Variáveis de Ambiente

Crie um arquivo `backend/.env` baseado no `.env.example`:

```env
DATABASE_URL=postgresql://studyquest:studyquest@localhost:5432/studyquest
SECRET_KEY=sua-chave-secreta-longa-e-aleatoria
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
DEBUG=True
```

---

## 🏆 Sistema de Conquistas

| Conquista | Condição | Bônus XP |
|-----------|----------|----------|
| 🎯 Primeira Conquista | Completar 1 tarefa | +25 XP |
| 🔥 Semana Perfeita | Streak de 7 dias | +100 XP |
| ⭐ Mestre do Conhecimento | 1000 XP total | +150 XP |
| 🚀 Estudante Dedicado | Alcançar nível 5 | +200 XP |
| 📚 Estudante Prolífico | Completar 10 tarefas | +75 XP |

---

## ⚡ Sistema de XP e Níveis

| Nível | XP necessário |
|-------|---------------|
| 1 → 2 | 100 XP |
| 2 → 3 | 200 XP |
| N → N+1 | N × 100 XP |

Cada classe de personagem aplica um multiplicador de XP em todas as tarefas.

---

## 📡 API Reference

### Auth
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/register` | Criar conta |
| POST | `/auth/login` | Fazer login |

### Usuário
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/users/me` | Perfil atual |
| PATCH | `/users/me` | Atualizar perfil |
| PATCH | `/users/me/password` | Alterar senha |

### Tarefas
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/tasks` | Listar tarefas |
| POST | `/tasks` | Criar tarefa |
| PATCH | `/tasks/{id}/complete` | Completar tarefa |

### Outros
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/achievements` | Conquistas |
| GET | `/ranking` | Ranking global |
| GET | `/notifications` | Notificações |
| GET | `/classes` | Classes disponíveis |

---

## 👨‍💻 Autor

Feito por **Guilherme Ribas**

[![GitHub](https://img.shields.io/badge/GitHub-Ribashow666-black?logo=github)](https://github.com/Ribashow666)

---

## 📄 Licença

Este projeto está sob a licença MIT.
