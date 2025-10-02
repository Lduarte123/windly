from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uvicorn

from features.alerta.controller import router as alerta_router
from features.searchbar.controller import router as searchbar_router
from features.sugestao_roupas.controller import router as sugestao_roupas_router

app = FastAPI(
    title="Windly AI Service",
    description="Serviço de IA para o aplicativo Windly - Previsão do tempo inteligente",
    version="1.0.0"
)

# Configuração CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique apenas os domínios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluindo os routers das funcionalidades
app.include_router(alerta_router, prefix="/api/ai", tags=["Alerta"])
app.include_router(searchbar_router, prefix="/api/ai", tags=["Chatbot"])
app.include_router(sugestao_roupas_router, prefix="/api/ai", tags=["Sugestão de Roupas"])

@app.get("/")
async def root():
    return {
        "message": "Windly AI Service está funcionando!",
        "version": "1.0.0",
        "endpoints": {
            "alerta": "/api/ai/alerta",
            "chatbot": "/api/ai/chatbot",
            "roupas": "/api/ai/roupas"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Windly AI"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
