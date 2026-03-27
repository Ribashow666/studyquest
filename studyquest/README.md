# 🎮 StudyQuest

Plataforma de gamificação de estudos inspirada em RPG. Ganhe XP, suba de nível, mantenha streaks e desbloqueie conquistas.

---

## 📁 Estrutura do Projeto

```
studyquest/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── alembic.ini
│   ├── alembic/
│   │   ├── env.py
│   │   ├── script.py.mako
│   │   └── versions/
│   └── app/
│       ├── main.py
│       ├── dependencies.py
│       ├── core/
│       │   ├── config.py
│       │   ├── database.py
│       │   └── security.py
│       ├── models/
│       │   ├── user.py
│       │   ├── task.py
│       │   └── achievement.py
│       ├── schemas/
│       │   ├── user.py
│       │   ├── task.py
│       │   └── achievement.py
│       ├── services/
│       │   ├── auth_service.py
│       │   ├── xp_service.py
│       │   ├── streak_service.py
│       │   ├── task_service.py
│       │   └── achievement_service.py
│       └── routers/
│           ├── auth.py
│           ├── users.py
│           ├── tasks.py
│           └── achievements.py
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── next.config.js
    ├── tailwind.config.js
    └── src/
        ├── app/
        │   ├── layout.tsx
        │   ├── globals.css
        │   ├── page.tsx
        │   ├── login/page.tsx
        │   ├── register/page.tsx
        │   └── dashboard/page.tsx
        ├── components/
        │   ├── Navbar.tsx
        │   ├── UserStats.tsx
        │   ├── XpBar.tsx
        │   ├── TaskList.tsx
        │   ├── Achievements.tsx
        │   ├── ProgressChart.tsx
        │   └── Toasts.tsx
        ├── lib/
        │   ├── api.ts
        │   └── auth-context.tsx
        └── types/
            └── index.ts
```

---

## 🚀 Como rodar

### Opção 1: Docker Compose (recomendado)

```bash
# Na raiz do projeto
docker-compose up --build
```

Acesse:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Docs Swagger: http://localhost:8000/docs

---

### Opção 2: Manual (desenvolvimento)

#### 1. PostgreSQL

```bash
# Via Docker (só o banco)
docker run -d \
  --name studyquest-db \
  -e POSTGRES_USER=studyquest \
  -e POSTGRES_PASSWORD=studyquest \
  -e POSTGRES_DB=studyquest \
  -p 5432:5432 \
  postgres:16-alpine
```

#### 2. Backend

```bash
cd backend

# Criar ambiente virtual
python -m venv .venv
source .venv/bin/activate        # Linux/Mac
# .venv\Scripts\activate         # Windows

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env se necessário

# Rodar o servidor (tabelas criadas automaticamente na inicialização)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 3. Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.local.example .env.local

# Rodar o servidor de desenvolvimento
npm run dev
```

---

## 🔌 API Reference

### Auth

#### Registrar usuário
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "senha123"
  }'
```

Resposta:
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@email.com",
  "level": 1,
  "xp": 0.0,
  "total_xp": 0.0,
  "streak": 0,
  "created_at": "2024-01-01T00:00:00Z",
  "xp_for_next_level": 100.0,
  "xp_progress_percent": 0.0
}
```

#### Login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "senha123"
  }'
```

Resposta:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

> Guarde o `access_token` para usar nas próximas requisições como `TOKEN`.

---

### Usuário

#### Obter perfil atual
```bash
curl http://localhost:8000/users/me \
  -H "Authorization: Bearer $TOKEN"
```

---

### Tarefas

#### Criar tarefa
```bash
curl -X POST http://localhost:8000/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Estudar capítulo 3 de Algoritmos",
    "description": "Árvores binárias e grafos",
    "xp_reward": 80
  }'
```

#### Listar tarefas
```bash
curl http://localhost:8000/tasks \
  -H "Authorization: Bearer $TOKEN"
```

#### Completar tarefa
```bash
curl -X PATCH http://localhost:8000/tasks/1/complete \
  -H "Authorization: Bearer $TOKEN"
```

Resposta:
```json
{
  "task": { "id": 1, "title": "Estudar capítulo 3...", "completed": true, ... },
  "xp_gained": 80.0,
  "level_up": false,
  "new_level": 1,
  "new_xp": 80.0,
  "new_streak": 1,
  "achievements_unlocked": ["Primeira Conquista"]
}
```

---

### Conquistas

#### Listar conquistas
```bash
curl http://localhost:8000/achievements \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🏆 Sistema de Conquistas

| Chave | Título | Condição | Bônus XP |
|-------|--------|----------|----------|
| `first_task` | Primeira Conquista | Completar 1 tarefa | +25 XP |
| `streak_7` | Semana Perfeita | Streak de 7 dias | +100 XP |
| `xp_1000` | Mestre do Conhecimento | 1000 XP total | +150 XP |
| `level_5` | Estudante Dedicado | Alcançar nível 5 | +200 XP |
| `tasks_10` | Estudante Prolífico | Completar 10 tarefas | +75 XP |

---

## ⭐ Sistema de XP e Níveis

| Nível | XP necessário |
|-------|---------------|
| 1 → 2 | 100 XP |
| 2 → 3 | 200 XP |
| 3 → 4 | 300 XP |
| N → N+1 | N × 100 XP |

O XP excedente é preservado ao subir de nível.

---

## 🔥 Sistema de Streak

- Estudou hoje → streak mantido (sem duplicatas no mesmo dia)
- Estudou no dia seguinte → streak +1
- Pulou um dia → streak resetado para 1

---

## 📚 Documentação interativa

Acesse http://localhost:8000/docs para a interface Swagger completa.
