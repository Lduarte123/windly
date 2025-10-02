from gemini.client import gemini_client
from .prompt import ROUPAS_BASE_PROMPT, ROUPAS_FORMAT_INSTRUCTIONS
import logging

logger = logging.getLogger(__name__)

class RoupasService:
    def __init__(self):
        """Inicializa o serviço de sugestão de roupas"""
        self.base_prompt = ROUPAS_BASE_PROMPT
        self.format_instructions = ROUPAS_FORMAT_INSTRUCTIONS
    
    async def suggest_outfit(self, weather_data: dict, occasion: str = "casual") -> dict:
        """
        Gera sugestões de roupas baseadas no clima e ocasião
        
        Args:
            weather_data (dict): Dados climáticos (temperatura, condição, umidade, etc.)
            occasion (str): Ocasião para a qual as roupas são necessárias
            
        Returns:
            dict: Sugestões de roupas com status e conteúdo
        """
        try:
            logger.info(f"👕 Gerando sugestões para: {occasion} - {weather_data.get('temperature', 'N/A')}°C")
            
            # Valida os dados de entrada
            if not weather_data or 'temperature' not in weather_data:
                return {
                    "success": False,
                    "error": "Dados climáticos incompletos ou inválidos",
                    "suggestions": None
                }
            
            # Monta o prompt específico
            prompt = f"""
Com base nas seguintes condições climáticas e ocasião, sugira um conjunto de roupas apropriado:

CONDIÇÕES CLIMÁTICAS:
- Temperatura: {weather_data.get('temperature')}°C
- Condição: {weather_data.get('condition', 'N/A')}
- Umidade: {weather_data.get('humidity', 'N/A')}%
- Vento: {weather_data.get('wind', 'N/A')}
- Sensação térmica: {weather_data.get('feels_like', weather_data.get('temperature'))}°C

OCASIÃO: {occasion.title()}

Por favor, forneça sugestões específicas e práticas de roupas adequadas para essas condições.
"""
            
            # Gera a resposta da IA
            ai_response = await gemini_client.generate_response(
                prompt=prompt,
                context=self.base_prompt
            )
            
            if ai_response and not ai_response.startswith("Erro"):
                logger.info("✅ Sugestões de roupas geradas com sucesso")
                return {
                    "success": True,
                    "suggestions": ai_response,
                    "weather_data": weather_data,
                    "occasion": occasion,
                    "error": None
                }
            else:
                logger.warning("⚠️ IA retornou erro ao gerar sugestões")
                return {
                    "success": False,
                    "error": ai_response,
                    "suggestions": None,
                    "weather_data": weather_data,
                    "occasion": occasion
                }
                
        except Exception as e:
            logger.error(f"❌ Erro no serviço de roupas: {e}")
            return {
                "success": False,
                "error": f"Erro interno do servidor: {str(e)}",
                "suggestions": None,
                "weather_data": weather_data,
                "occasion": occasion
            }
    
    async def get_seasonal_recommendations(self, season: str, style_preference: str = "versatile") -> dict:
        """
        Gera recomendações sazonais de roupas
        
        Args:
            season (str): Estação do ano (verão, inverno, primavera, outono)
            style_preference (str): Preferência de estilo do usuário
            
        Returns:
            dict: Recomendações sazonais
        """
        try:
            logger.info(f"🍂 Gerando recomendações para {season} - estilo {style_preference}")
            
            prompt = f"""
Forneça recomendações de roupas para a estação {season}, considerando o estilo {style_preference}.

Inclua:
- Peças essenciais para a estação
- Materiais e tecidos recomendados
- Combinações versáteis
- Dicas de transição entre estações
- Acessórios apropriados
"""
            
            response = await gemini_client.generate_response(
                prompt=prompt,
                context=self.base_prompt
            )
            
            return {
                "success": True,
                "season": season,
                "style": style_preference,
                "recommendations": response,
                "error": None
            }
            
        except Exception as e:
            logger.error(f"❌ Erro ao gerar recomendações sazonais: {e}")
            return {
                "success": False,
                "error": str(e)
            }

# Instância global do serviço
roupas_service = RoupasService()