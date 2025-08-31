from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from .service import roupas_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

class WeatherDataRequest(BaseModel):
    temperature: float
    condition: str
    humidity: Optional[int] = None
    wind: Optional[str] = None
    feels_like: Optional[float] = None
    user_id: Optional[str] = None

class OutfitRequest(BaseModel):
    weather_data: WeatherDataRequest
    occasion: str = "casual"
    style_preference: Optional[str] = "versatile"

class SeasonalRequest(BaseModel):
    season: str
    style_preference: str = "versatile"
    user_id: Optional[str] = None

class OutfitResponse(BaseModel):
    success: bool
    suggestions: Optional[str] = None
    weather_data: Optional[dict] = None
    occasion: Optional[str] = None
    error: Optional[str] = None
    timestamp: Optional[str] = None

@router.post("/roupas/outfit", response_model=OutfitResponse)
async def suggest_outfit(request: OutfitRequest):
    """
    Endpoint para sugerir roupas baseadas no clima e ocasião
    """
    try:
        logger.info(f"👕 Sugestão de roupas para: {request.occasion} - {request.weather_data.temperature}°C")
        
        # Converte o modelo Pydantic para dict
        weather_dict = {
            "temperature": request.weather_data.temperature,
            "condition": request.weather_data.condition,
            "humidity": request.weather_data.humidity,
            "wind": request.weather_data.wind,
            "feels_like": request.weather_data.feels_like
        }
        
        # Gera as sugestões
        result = await roupas_service.suggest_outfit(
            weather_data=weather_dict,
            occasion=request.occasion
        )
        
        # Adiciona timestamp
        from datetime import datetime
        result["timestamp"] = datetime.now().isoformat()
        
        if result["success"]:
            logger.info("✅ Sugestões de roupas geradas com sucesso")
        else:
            logger.warning("⚠️ Erro ao gerar sugestões de roupas")
            
        return OutfitResponse(**result)
        
    except Exception as e:
        logger.error(f"❌ Erro no endpoint de roupas: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Erro interno do servidor: {str(e)}"
        )

@router.post("/roupas/seasonal", response_model=dict)
async def get_seasonal_recommendations(request: SeasonalRequest):
    """
    Endpoint para obter recomendações sazonais de roupas
    """
    try:
        logger.info(f"🍂 Recomendações sazonais para: {request.season} - {request.style_preference}")
        
        result = await roupas_service.get_seasonal_recommendations(
            season=request.season,
            style_preference=request.style_preference
        )
        
        if result["success"]:
            logger.info("✅ Recomendações sazonais geradas com sucesso")
        else:
            logger.warning("⚠️ Erro ao gerar recomendações sazonais")
            
        return result
        
    except Exception as e:
        logger.error(f"❌ Erro ao obter recomendações sazonais: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Erro interno do servidor: {str(e)}"
        )

@router.get("/roupas/health")
async def roupas_health():
    """
    Endpoint de verificação de saúde do serviço de roupas
    """
    return {
        "status": "healthy",
        "service": "Sugestão de Roupas AI",
        "endpoints": {
            "outfit": "POST /roupas/outfit",
            "seasonal": "POST /roupas/seasonal"
        }
    }