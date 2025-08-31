from gemini.client import gemini_client
from .prompt import CHATBOT_BASE_PROMPT, CHATBOT_FORMAT_INSTRUCTIONS
import logging

logger = logging.getLogger(__name__)

class ChatbotService:
    def __init__(self):
        """Inicializa o serviço do chatbot"""
        self.base_prompt = CHATBOT_BASE_PROMPT
        self.format_instructions = CHATBOT_FORMAT_INSTRUCTIONS
    
    async def process_question(self, user_question: str, user_context: str = "") -> dict:
        """
        Processa a pergunta do usuário e retorna uma resposta da IA
        
        Args:
            user_question (str): A pergunta do usuário
            user_context (str): Contexto adicional (opcional)
            
        Returns:
            dict: Resposta processada com status e conteúdo
        """
        try:
            logger.info(f"📝 Processando pergunta: {user_question[:50]}...")
            
            # Valida a entrada
            if not user_question or not user_question.strip():
                return {
                    "success": False,
                    "error": "Pergunta não pode estar vazia",
                    "response": None
                }
            
            # Monta o contexto completo
            full_context = self.base_prompt
            if user_context:
                full_context += f"\n\nContexto adicional do usuário: {user_context}"
            
            # Gera a resposta da IA
            ai_response = await gemini_client.generate_response(
                prompt=user_question,
                context=full_context
            )
            
            # Verifica se a resposta foi bem-sucedida
            if ai_response and not ai_response.startswith("Erro"):
                logger.info("✅ Resposta gerada com sucesso")
                return {
                    "success": True,
                    "response": ai_response,
                    "error": None,
                    "question": user_question
                }
            else:
                logger.warning("⚠️ IA retornou erro ou resposta vazia")
                return {
                    "success": False,
                    "error": ai_response,
                    "response": None,
                    "question": user_question
                }
                
        except Exception as e:
            logger.error(f"❌ Erro no serviço do chatbot: {e}")
            return {
                "success": False,
                "error": f"Erro interno do servidor: {str(e)}",
                "response": None,
                "question": user_question
            }
    
    async def get_weather_tips(self, weather_conditions: dict) -> dict:
        """
        Gera dicas específicas baseadas nas condições climáticas
        
        Args:
            weather_conditions (dict): Dados das condições climáticas
            
        Returns:
            dict: Dicas personalizadas
        """
        try:
            prompt = f"""
Com base nas seguintes condições climáticas, forneça dicas úteis e práticas:

Temperatura: {weather_conditions.get('temperature', 'N/A')}°C
Umidade: {weather_conditions.get('humidity', 'N/A')}%
Condição: {weather_conditions.get('condition', 'N/A')}
Vento: {weather_conditions.get('wind', 'N/A')}

Forneça:
1. Dicas de vestuário
2. Atividades recomendadas
3. Precauções de segurança
4. Dicas para planejamento do dia
"""
            
            response = await gemini_client.generate_response(
                prompt=prompt,
                context=self.base_prompt
            )
            
            return {
                "success": True,
                "tips": response,
                "weather_conditions": weather_conditions
            }
            
        except Exception as e:
            logger.error(f"❌ Erro ao gerar dicas climáticas: {e}")
            return {
                "success": False,
                "error": str(e)
            }

# Instância global do serviço
chatbot_service = ChatbotService()