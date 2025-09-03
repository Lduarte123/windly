from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_KEY")

# Inicializa cliente Gemini
client = genai.Client(api_key=GEMINI_API_KEY)

# Prompt-base para análise do clima
ClimaPromptBase = """
Você é um assistente especializado em meteorologia. Sua tarefa é analisar informações climáticas de uma cidade e gerar uma resposta amigável, clara e útil para o usuário.

Inclua:
1. Um resumo do clima atual
2. Dicas relevantes baseadas nas condições (ex: levar guarda-chuva, se hidratar, etc)
3. Riscos potenciais, se houver (ex: calor extremo, chuvas fortes)
4. Sugestões de roupas ou cuidados
5. Um tom acessível, útil e acolhedor

Não invente dados. Baseie-se estritamente nas informações fornecidas.
"""

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/analise-clima")
async def analisar_clima(request: Request):
    """
    Espera um JSON com:
    {
        "cidade": "Nome da cidade",
        "dados_climaticos": "Texto descritivo com as condições atuais"
    }
    """
    try:
        body = await request.json()
        cidade = body.get("cidade")
        dados = body.get("dados_climaticos")

        if not cidade or not dados:
            return JSONResponse(
                status_code=400,
                content={"erro": "Parâmetros 'cidade' e 'dados_climaticos' são obrigatórios."}
            )

        # Monta o prompt final
        prompt = f"""
Cidade: {cidade}
Condições Climáticas:
{dados}
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=ClimaPromptBase + "\n\n" + prompt,
        )

        return {
            "cidade": cidade,
            "analise": response.text
        }

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"erro": f"Erro ao processar análise climática: {str(e)}"}
        )
