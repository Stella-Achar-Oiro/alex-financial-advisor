# Alex AI Financial Advisor

A production-grade AI financial advisor powered by a multi-agent orchestra. Users manage investment portfolios across multiple accounts and trigger AI analysis that runs five specialized agents in parallel, producing portfolio reports, interactive charts, and retirement projections.

**Live:** https://dzbkw0e9qk4mc.cloudfront.net

---

## Agent Architecture

```
User triggers analysis
        │
        ▼
    SQS Queue
        │
        ▼
  Financial Planner (Orchestrator Lambda)
        ├── InstrumentTagger  — classifies ETFs with structured rationale logging
        ├── Portfolio Analyst — markdown report with S3 Vectors RAG
        ├── Chart Specialist  — 5 Recharts-compatible JSON visualizations
        └── Retirement Planner — Monte Carlo projections
        │
        ▼
   Aurora DB → CloudFront → User
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (Pages Router), TypeScript, Tailwind CSS, Recharts, Clerk auth |
| API | FastAPI on AWS Lambda + API Gateway |
| Agent framework | OpenAI Agents SDK + LiteLLM (Bedrock backend) |
| AI model | Amazon Nova Pro (`us.amazon.nova-pro-v1:0`) via Bedrock (us-west-2) |
| Embeddings | SageMaker Serverless endpoint (`all-MiniLM-L6-v2`, 384 dims) |
| Vector store | AWS S3 Vectors |
| Database | Aurora Serverless v2 PostgreSQL with Data API |
| Queue | SQS (triggers planner Lambda) |
| CDN | CloudFront + S3 static hosting |
| Observability | LangFuse (full agent tracing) + CloudWatch dashboards |
| Infrastructure | Terraform across all 8 deployment stages |

## Repository Structure

```
backend/
  planner/     — orchestrator Lambda (SQS trigger, coordinates agents)
  tagger/      — InstrumentTagger agent (ETF classification + rationale)
  reporter/    — Portfolio Analyst agent (markdown report + RAG)
  charter/     — Chart Specialist agent (5 chart types)
  retirement/  — Retirement Planner agent (Monte Carlo)
frontend/      — Next.js app with collapsible sidebar, Clerk auth
terraform/
  1_permissions/
  2_sagemaker/
  3_ingest/
  4_researcher/
  5_database/
  6_agents/
  7_frontend/
  8_enterprise/
```

## Key Features

- **Multi-agent orchestration** — 5 Lambda-based agents coordinated via SQS
- **Explainability** — tagger logs structured chain-of-thought rationale for every classification
- **LangFuse observability** — full traces, token usage, and latency per agent run
- **CloudWatch dashboards** — Bedrock/SageMaker metrics + agent performance monitoring
- **Scale to zero** — fully serverless, costs ~$0 when idle

## Local Development

### Backend (any agent)
```bash
cd backend/<agent>
uv sync
uv run python lambda_handler.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev      # http://localhost:3000
```

Copy `frontend/.env.local.example` to `frontend/.env.local` and fill in your Clerk + API keys.

## Infrastructure Deployment

Each `terraform/` subdirectory is independent. Deploy in order:

```bash
cd terraform/2_sagemaker
terraform init && terraform apply

cd ../3_ingest
terraform init && terraform apply
# ... repeat through 8_enterprise
```

---

Built as the Week 4 capstone for the [AI in Production](https://github.com/ed-donner/production) course by Edward Donner.
