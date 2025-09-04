from google import genai
from config import settings
import logging

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GeminiClient:
    def __init__(self):
        """Inicializa o cliente Gemini com a chave da API ou modo demo"""
        self.demo_mode = not bool(settings.GEMINI_API_KEY)
        
        if self.demo_mode:
            logger.warning("⚠️ Modo de demonstração ativado - usando respostas simuladas")
            self.model = None
        else:
            try:
                genai.configure(api_key=settings.GEMINI_API_KEY)
                self.model = genai.GenerativeModel('gemini-pro')
                logger.info("✅ Cliente Gemini inicializado com sucesso")
            except Exception as e:
                logger.error(f"❌ Erro ao inicializar cliente Gemini: {e}")
                raise
    
    def _get_demo_response(self, prompt: str, context: str = "") -> str:
        """Gera respostas simuladas para demonstração"""
        prompt_lower = prompt.lower()
        
        # Respostas baseadas no contexto da pergunta
        if any(word in prompt_lower for word in ['clima', 'tempo', 'temperatura']):
            return """🌤️ **Informações sobre o Clima**

Com base na sua pergunta sobre clima, aqui estão algumas informações úteis:

**Condições Atuais:**
- Temperatura: 24°C
- Umidade: 65%
- Condição: Ensolarado com algumas nuvens
- Vento: Leve, 10 km/h

**Dicas:**
- É um dia agradável para atividades ao ar livre
- Use protetor solar se for sair
- Mantenha-se hidratado

**Previsão:**
- Manhã: Ensolarado
- Tarde: Algumas nuvens
- Noite: Limpo

*Nota: Esta é uma resposta de demonstração. Para informações reais, configure sua chave da API Gemini.*"""
        
        elif any(word in prompt_lower for word in ['roupa', 'vestir', 'vestuário']):
            return """👕 **Sugestões de Roupas**

Para as condições climáticas atuais (24°C, ensolarado), recomendo:

**Peças Principais:**
- Camiseta de algodão ou tecido respirável
- Calça leve ou bermuda
- Vestido casual (para mulheres)

**Acessórios:**
- Chapéu ou boné para proteção solar
- Óculos de sol
- Tênis confortáveis

**Dicas:**
- Prefira tecidos claros que refletem o sol
- Evite roupas muito escuras ou pesadas
- Mantenha um casaco leve para a noite

*Nota: Esta é uma resposta de demonstração. Para sugestões personalizadas, configure sua chave da API Gemini.*"""
        
        elif any(word in prompt_lower for word in ['alerta', 'perigo', 'risco']):
            return """⚠️ **Alerta Climático - Nível AMARELO**

**Situação Atual:**
- Condições climáticas dentro do normal
- Sem riscos significativos identificados

**Recomendações:**
- Mantenha-se informado sobre mudanças no tempo
- Tenha um plano de emergência básico
- Monitore alertas oficiais

**Contatos de Emergência:**
- Defesa Civil: 199
- Bombeiros: 193
- Polícia: 190
- SAMU: 192

*Nota: Este é um alerta de demonstração. Para alertas reais, configure sua chave da API Gemini.*"""
        
        else:
            return """🤖 **Resposta da IA Windly**

Olá! Sou o assistente de IA do Windly, especializado em meteorologia e clima.

**Como posso ajudar:**
- Informações sobre clima e previsão do tempo
- Sugestões de roupas baseadas no clima
- Alertas climáticos e dicas de segurança
- Explicações sobre fenômenos meteorológicos

**Exemplo de perguntas:**
- "Como está o clima hoje?"
- "Que roupa devo usar para 25°C?"
- "Há algum alerta climático?"

*Nota: Esta é uma resposta de demonstração. Para respostas reais da IA, configure sua chave da API Gemini.*"""
    
    async def generate_response(self, prompt: str, context: str = "") -> str:
        """
        Gera uma resposta da IA baseada no prompt e contexto fornecidos
        
        Args:
            prompt (str): O prompt principal para a IA
            context (str): Contexto adicional (opcional)
            
        Returns:
            str: Resposta gerada pela IA
        """
        try:
            if self.demo_mode:
                # Modo de demonstração
                response = self._get_demo_response(prompt, context)
                logger.info(f"🎭 Resposta de demonstração gerada ({len(response)} caracteres)")
                return response
            
            # Modo real com API Gemini
            # Monta o prompt completo com contexto
            full_prompt = f"{context}\n\n{prompt}" if context else prompt
            
            # Configurações da geração
            generation_config = {
                "temperature": settings.TEMPERATURE,
                "max_output_tokens": settings.MAX_TOKENS,
                "top_p": 0.8,
                "top_k": 40
            }
            
            # Gera a resposta
            response = self.model.generate_content(
                full_prompt,
                generation_config=generation_config
            )
            
            if response.text:
                logger.info(f"✅ Resposta gerada com sucesso ({len(response.text)} caracteres)")
                return response.text
            else:
                logger.warning("⚠️ IA retornou resposta vazia")
                return "Desculpe, não consegui gerar uma resposta para sua pergunta."
                
        except Exception as e:
            logger.error(f"❌ Erro ao gerar resposta: {e}")
            if self.demo_mode:
                return "Erro no modo de demonstração. Verifique os logs para mais detalhes."
            return f"Erro ao processar sua solicitação: {str(e)}"
    
    async def generate_structured_response(self, prompt: str, context: str = "", format_instructions: str = "") -> dict:
        """
        Gera uma resposta estruturada da IA
        
        Args:
            prompt (str): O prompt principal
            context (str): Contexto adicional
            format_instructions (str): Instruções de formatação
            
        Returns:
            dict: Resposta estruturada
        """
        try:
            if self.demo_mode:
                # Modo de demonstração com resposta estruturada
                response = self._get_demo_response(prompt, context)
                return {
                    "response": response,
                    "demo_mode": True,
                    "message": "Resposta em modo de demonstração"
                }
            
            # Modo real
            structured_prompt = f"""
{context}

{prompt}

{format_instructions}

Por favor, responda no formato solicitado.
"""
            
            response = await self.generate_response(structured_prompt)
            
            # Tenta fazer parse da resposta como JSON
            import json
            try:
                return json.loads(response)
            except json.JSONDecodeError:
                return {"response": response, "error": "Formato não pôde ser parseado"}
                
        except Exception as e:
            logger.error(f"❌ Erro ao gerar resposta estruturada: {e}")
            return {"error": str(e)}

# Instância global do cliente
gemini_client = GeminiClient()