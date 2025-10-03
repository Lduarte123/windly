from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from .service import alerta_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

class WeatherAlertRequest(BaseModel):
    temperature: float
    condition: str
    humidity: Optional[int] = None
    wind: Optional[str] = None
    pressure: Optional[float] = None
    visibility: Optional[float] = None
    feels_like: Optional[float] = None
    location: str = "local"
    user_id: Optional[str] = None

class EmergencyContactsRequest(BaseModel):
    location: str
    user_id: Optional[str] = None

class WeatherAlertResponse(BaseModel):
    success: bool
    alert: Optional[str] = None
    risk_level: Optional[str] = None
    weather_data: Optional[dict] = None
    location: Optional[str] = None
    timestamp: Optional[str] = None
    error: Optional[str] = None

@router.post("/alerta/weather", response_model=WeatherAlertResponse)
async def generate_weather_alert(request: WeatherAlertRequest):
    """
    Endpoint para gerar alertas climáticos baseados em dados meteorológicos
    """
    try:
        logger.info(f"⚠️ Gerando alerta para: {request.location} - {request.condition}")
        
        # Converte o modelo Pydantic para dict
        weather_dict = {
            "temperature": request.temperature,
            "condition": request.condition,
            "humidity": request.humidity,
            "wind": request.wind,
            "pressure": request.pressure,
            "visibility": request.visibility,
            "feels_like": request.feels_like
        }
        
        # Gera o alerta
        result = await alerta_service.generate_weather_alert(
            weather_data=weather_dict,
            location=request.location
        )
        
        if result["success"]:
            logger.info(f"✅ Alerta gerado com sucesso - Nível: {result.get('risk_level', 'N/A')}")
        else:
            logger.warning("⚠️ Erro ao gerar alerta")
            
        return WeatherAlertResponse(**result)
        
    except Exception as e:
        logger.error(f"❌ Erro no endpoint de alertas: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Erro interno do servidor: {str(e)}"
        )

@router.post("/alerta/emergency-contacts", response_model=dict)
async def get_emergency_contacts(request: EmergencyContactsRequest):
    """
    Endpoint para obter contatos de emergência para uma localização
    """
    try:
        logger.info(f"📞 Solicitando contatos de emergência para: {request.location}")
        
        result = await alerta_service.get_emergency_contacts(request.location)
        
        if result["success"]:
            logger.info("✅ Contatos de emergência obtidos com sucesso")
        else:
            logger.warning("⚠️ Erro ao obter contatos de emergência")
            
        return result
        
    except Exception as e:
        logger.error(f"❌ Erro ao obter contatos de emergência: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Erro interno do servidor: {str(e)}"
        )

@router.get("/alerta/health")
async def alerta_health():
    """
    Endpoint de verificação de saúde do serviço de alertas
    """
    return {
        "status": "healthy",
        "service": "Alertas Climáticos AI",
        "endpoints": {
            "weather_alert": "POST /alerta/weather",
            "emergency_contacts": "POST /alerta/emergency-contacts"
        }
    }