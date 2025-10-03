from gemini.client import gemini_client
from .prompt import ALERTA_BASE_PROMPT, ALERTA_FORMAT_INSTRUCTIONS
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class AlertaService:
    def __init__(self):
        """Inicializa o serviço de alertas climáticos"""
        self.base_prompt = ALERTA_BASE_PROMPT
        self.format_instructions = ALERTA_FORMAT_INSTRUCTIONS
    
    async def generate_weather_alert(self, weather_data: dict, location: str = "local") -> dict:
        """
        Gera um alerta climático baseado nos dados meteorológicos
        
        Args:
            weather_data (dict): Dados climáticos (temperatura, condição, umidade, etc.)
            location (str): Localização para contextualizar o alerta
            
        Returns:
            dict: Alerta gerado com nível de risco e recomendações
        """
        try:
            logger.info(f"⚠️ Gerando alerta para: {location} - {weather_data.get('condition', 'N/A')}")
            
            # Valida os dados de entrada
            if not weather_data or 'condition' not in weather_data:
                return {
                    "success": False,
                    "error": "Dados climáticos incompletos ou inválidos",
                    "alert": None
                }
            
            # Monta o prompt específico para o alerta
            prompt = f"""
Analise as seguintes condições climáticas e gere um alerta apropriado para a localização {location}:

DADOS CLIMÁTICOS:
- Temperatura: {weather_data.get('temperature', 'N/A')}°C
- Condição: {weather_data.get('condition', 'N/A')}
- Umidade: {weather_data.get('humidity', 'N/A')}%
- Vento: {weather_data.get('wind', 'N/A')}
- Pressão: {weather_data.get('pressure', 'N/A')} hPa
- Visibilidade: {weather_data.get('visibility', 'N/A')} km
- Sensação térmica: {weather_data.get('feels_like', weather_data.get('temperature'))}°C

LOCALIZAÇÃO: {location}

Com base nesses dados, gere um alerta apropriado incluindo:
1. Nível de risco (verde, amarelo, laranja ou vermelho)
2. Descrição clara da situação
3. Riscos específicos identificados
4. Medidas de proteção recomendadas
5. Instruções para a população
"""
            
            # Gera o alerta via IA
            ai_response = await gemini_client.generate_response(
                prompt=prompt,
                context=self.base_prompt
            )
            
            if ai_response and not ai_response.startswith("Erro"):
                # Determina o nível de risco baseado na resposta
                risk_level = self._determine_risk_level(ai_response, weather_data)
                
                logger.info(f"✅ Alerta gerado com sucesso - Nível: {risk_level}")
                return {
                    "success": True,
                    "alert": ai_response,
                    "risk_level": risk_level,
                    "weather_data": weather_data,
                    "location": location,
                    "timestamp": datetime.now().isoformat(),
                    "error": None
                }
            else:
                logger.warning("⚠️ IA retornou erro ao gerar alerta")
                return {
                    "success": False,
                    "error": ai_response,
                    "alert": None,
                    "weather_data": weather_data,
                    "location": location
                }
                
        except Exception as e:
            logger.error(f"❌ Erro no serviço de alertas: {e}")
            return {
                "success": False,
                "error": f"Erro interno do servidor: {str(e)}",
                "alert": None,
                "weather_data": weather_data,
                "location": location
            }
    
    def _determine_risk_level(self, alert_text: str, weather_data: dict) -> str:
        """
        Determina o nível de risco baseado no texto do alerta e dados climáticos
        
        Args:
            alert_text (str): Texto do alerta gerado pela IA
            weather_data (dict): Dados climáticos originais
            
        Returns:
            str: Nível de risco (verde, amarelo, laranja, vermelho)
        """
        try:
            # Análise baseada no texto do alerta
            alert_lower = alert_text.lower()
            
            if any(word in alert_lower for word in ['vermelho', '🔴', 'extremo', 'crítico', 'emergência']):
                return "vermelho"
            elif any(word in alert_lower for word in ['laranja', '🟠', 'perigo', 'alto risco']):
                return "laranja"
            elif any(word in alert_lower for word in ['amarelo', '🟡', 'atenção', 'cuidado']):
                return "amarelo"
            else:
                return "verde"
                
        except Exception as e:
            logger.warning(f"⚠️ Erro ao determinar nível de risco: {e}")
            return "amarelo"  # Padrão conservador
    
    async def get_emergency_contacts(self, location: str) -> dict:
        """
        Retorna contatos de emergência para a localização
        
        Args:
            location (str): Localização para buscar contatos
            
        Returns:
            dict: Contatos de emergência
        """
        try:
            prompt = f"""
Forneça os contatos de emergência mais importantes para {location}, incluindo:
- Defesa Civil
- Bombeiros
- Polícia
- Ambulância/SAMU
- Prefeitura
- Outros serviços relevantes

Formate como uma lista clara e organizada.
"""
            
            response = await gemini_client.generate_response(
                prompt=prompt,
                context=self.base_prompt
            )
            
            return {
                "success": True,
                "location": location,
                "contacts": response,
                "error": None
            }
            
        except Exception as e:
            logger.error(f"❌ Erro ao obter contatos de emergência: {e}")
            return {
                "success": False,
                "error": str(e)
            }

# Instância global do serviço
alerta_service = AlertaService()