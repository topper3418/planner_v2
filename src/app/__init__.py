from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import os

from src.scheduler.run import ensure_scheduled_tickets_reopened_for_today

from .actions import router as actions_router
from .things import router as things_router
from .tickets import router as tickets_router
from .milestones import router as milestones_router
from .schedules import router as schedules_router
from .users import router as users_router

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    try:
        ensure_scheduled_tickets_reopened_for_today()
    except Exception:
        logger.exception("Failed to run startup scheduled ticket reopening")
    yield


app = FastAPI(lifespan=lifespan)


def _get_cors_origins() -> list[str]:
    """
    CORS origin configuration.

    Controlled via the CORS_ALLOW_ORIGINS environment variable.
    - Comma-separated list of allowed origins, e.g.:
        "http://localhost:5173,http://devpi.local"
    - Set to "*" to allow any origin (will force allow_credentials=False,
      because browsers forbid credentials with wildcard origins).
    - If the variable is not set, we use a sensible default list covering
      local development and the known New World platform host.

    Why env-driven?
    - Avoids hardcoding.
    - New World platform (or other deploys) can inject the correct value(s)
      via mcp-app.yaml `backend.env` or platform-level configuration.
    - Same-origin requests after a New World deploy (under /apps/<name>/)
      usually don't require CORS at all.
    """
    raw = os.getenv("CORS_ALLOW_ORIGINS", "").strip()

    if raw == "*":
        return ["*"]

    if raw:
        return [origin.strip() for origin in raw.split(",") if origin.strip()]

    # Default origins for dev + this platform
    return [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://devpi.local",
    ]


cors_origins = _get_cors_origins()

# You cannot use allow_credentials=True together with allow_origins=["*"]
allow_credentials = "*" not in cors_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(actions_router)
app.include_router(things_router)
app.include_router(tickets_router)
app.include_router(milestones_router)
app.include_router(schedules_router)
app.include_router(users_router)


# healthcheck endpoint
@app.get("/healthcheck")
async def healthcheck():
    return {"status": "ok"}

# New World / Conductor compatible health endpoint (must return 2xx on unix socket)
@app.get("/health")
async def health():
    return {"status": "ok"}
