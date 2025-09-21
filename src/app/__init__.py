from fastapi import FastAPI

from .actions import router as actions_router
from .categories import router as categories_router
from .comments import router as comments_router
from .things import router as things_router
from .tickets import router as tickets_router

from .thingView import router as thing_view_router

app = FastAPI()

app.include_router(actions_router)
app.include_router(categories_router)
app.include_router(comments_router)
app.include_router(things_router)
app.include_router(tickets_router)
app.include_router(thing_view_router)
