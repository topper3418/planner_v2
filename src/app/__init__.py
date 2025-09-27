from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .actions import router as actions_router
from .comments import router as comments_router
from .things import router as things_router
from .tickets import router as tickets_router

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

app.include_router(actions_router)
app.include_router(comments_router)
app.include_router(things_router)
app.include_router(tickets_router)


# healthcheck endpoint
@app.get("/healthcheck")
async def healthcheck():
    return {"status": "ok"}
