from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from .service import chatbot_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

class ChatbotRequest(BaseModel):
    question: str
    context: Optional[str] = ""
    user_id: Optional[str] = None

class WeatherTipsRequest(BaseModel):
    temperature: float
    humidity: int
    condition: str
    wind: Optional[str] = None
    user_id: Optional[str] = None

class ChatbotResponse(BaseModel):
    success: bool
    response: Optional[str] = None
    error: Optional[str] = None
    question: Optional[str] = None
    timestamp: Optional[str] = None

@router.post("/chatbot", response_model=ChatbotResponse)
async def process_question(request: ChatbotRequest):
    """
    Endpoint para processar perguntas do usuário via chatbot
    """
    try:
        logger.info(f"📨 Nova pergunta recebida: {request.question[:50]}...")
        
        # Processa a pergunta
        result = await chatbot_service.process_question(
            user_question=request.question,
            user_context=request.context
        )
        
        # Adiciona timestamp
        from datetime import datetime
        result["timestamp"] = datetime.now().isoformat()
        
        logger.info(f"✅ Pergunta processada com sucesso")
        return ChatbotResponse(**result)
        
    except Exception as e:
        logger.error(f"❌ Erro no endpoint do chatbot: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Erro interno do servidor: {str(e)}"
        )

@router.post("/chatbot/tips", response_model=dict)
async def get_weather_tips(request: WeatherTipsRequest):
    """
    Endpoint para obter dicas climáticas personalizadas
    """
    try:
        logger.info(f"🌤️ Solicitando dicas para: {request.condition} - {request.temperature}°C")
        
        weather_data = {
            "temperature": request.temperature,
            "humidity": request.humidity,
            "condition": request.condition,
            "wind": request.wind or "N/A"
        }
        
        result = await chatbot_service.get_weather_tips(weather_data)
        
        if result["success"]:
            logger.info("✅ Dicas climáticas geradas com sucesso")
        else:
            logger.warning("⚠️ Erro ao gerar dicas climáticas")
            
        return result
        
    except Exception as e:
        logger.error(f"❌ Erro ao obter dicas climáticas: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Erro interno do servidor: {str(e)}"
        )

@router.get("/chatbot/health")
async def chatbot_health():
    """
    Endpoint de verificação de saúde do chatbot
    """
    return {
        "status": "healthy",
        "service": "Chatbot AI",
        "endpoints": {
            "question": "POST /chatbot",
            "tips": "POST /chatbot/tips"
        }
    }