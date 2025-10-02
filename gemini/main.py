# 
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_KEY")

if not GEMINI_API_KEY:
    raise ValueError("The API key 'GEMINI_KEY' was not found in .env.")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- PROMPTS REFORMULADOS ---
ClimaPromptBase = """
Você é um assistente meteorológico. Baseie-se estritamente nos dados fornecidos e gere uma resposta curta, clara e objetiva.
Inclua resumo do clima, dicas de cuidado, riscos potenciais e sugestões de vestimenta. Responda em português, sem markdown.
"""

SugestaoRoupaPrompt = """
Você é um assistente pessoal climático. Gere apenas sugestões de roupas com base no clima e cidade fornecidos.
Responda de forma curta, clara e objetiva, sem markdown ou explicações extras.
"""

AlertaClimaPrompt = """
Você é um assistente de monitoramento climático. Seu objetivo é detectar apenas condições anormais:
- Temperatura muito alta ou muito baixa
- Vento muito forte
- Tempestades ou condições que não correspondem ao local/época do ano

Se não houver anomalias, retorne apenas: "Sem alertas no momento".
Responda curto, objetivo e em português.
"""

# --- MODELS ---
class AnaliseClimaInput(BaseModel):
    cidade: str
    dados_climaticos: str

class RecomendacaoRequest(BaseModel):
    cidade: str
    clima: dict 

class AlertaClimaInput(BaseModel):
    cidade: str
    dados_climaticos: dict

# --- ENDPOINTS ---
@app.post("/sugerir-roupa")
async def sugerir_roupa(input_data: RecomendacaoRequest):
    try:
        prompt = f"City: {input_data.cidade}\nWeather Conditions: {input_data.clima}"
        response = model.generate_content(contents=SugestaoRoupaPrompt + "\n\n" + prompt)
        return {"analise": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar análise de roupa: {str(e)}")

@app.post("/analise-clima")
async def analisar_clima(input_data: AnaliseClimaInput):
    try:
        prompt = f"City: {input_data.cidade}\nWeather Conditions: {input_data.dados_climaticos}"
        response = model.generate_content(contents=ClimaPromptBase + "\n\n" + prompt)
        return {"cidade": input_data.cidade, "analise": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar análise de clima: {str(e)}")

@app.post("/alerta-clima")
async def alerta_clima(input_data: AlertaClimaInput):
    try:
        prompt = f"City: {input_data.cidade}\nWeather Conditions: {input_data.dados_climaticos}"
        response = model.generate_content(contents=AlertaClimaPrompt + "\n\n" + prompt)
        return {"cidade": input_data.cidade, "alerta": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar alerta climático: {str(e)}")


# ClimaPromptBase = """
# # You are a meteorology specialist assistant. Your task is to analyze weather information for a city and generate a friendly, clear, and helpful response to the user.

# # Include:
# # 1. A summary of the current weather
# # 2. Relevant tips based on the conditions (e.g. take an umbrella, stay hydrated, etc.)
# # 3. Potential risks, if any (e.g. extreme heat, heavy rain)
# # 4. Clothing or care suggestions
# # 5. An accessible, helpful, and welcoming tone
# # 6. The reponse must be in portuguese (Brazil) 

# # Do not invent data. Base yourself strictly on the information provided.
# # """



# SugestaoRoupaPrompt = """
# Você é um assistente pessoal climático. Você deve analisar o clima e a cidade atual para gerar sugestão ou sugestões de roupas
# de acordo com o clima e cidade que o usuário está

# - Você só pode responder sobre algo pertinente às vestimentas relacionados ao clima
# - Use como base apenas os dados que você receber de cidade e seus status atual
# - Responda apenas as recomendações vestuárias, NÃO PRECISA DIZER O LOCAL

# """