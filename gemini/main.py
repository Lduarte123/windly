from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from google import generativeai as genai
import os
from dotenv import load_dotenv
from pydantic import BaseModel

# Loads the environment variables from the .env file
load_dotenv()

# Gets the API key
GEMINI_API_KEY = os.getenv("GEMINI_KEY")

# Checks if the key was loaded
if not GEMINI_API_KEY:
    raise ValueError("The API key 'GEMINI_KEY' was not found. Make sure it is defined in your .env file.")

# Configures the Gemini client
genai.configure(api_key=GEMINI_API_KEY)

# Defines the base prompt for weather analysis
ClimaPromptBase = """
You are a meteorology specialist assistant. Your task is to analyze weather information for a city and generate a friendly, clear, and helpful response to the user.

Include:
1. A summary of the current weather
2. Relevant tips based on the conditions (e.g. take an umbrella, stay hydrated, etc.)
3. Potential risks, if any (e.g. extreme heat, heavy rain)
4. Clothing or care suggestions
5. An accessible, helpful, and welcoming tone

Do not invent data. Base yourself strictly on the information provided.
"""

# Creates the FastAPI application
app = FastAPI()

# Configures the CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnaliseClimaInput(BaseModel):
    cidade: str
    dados_climaticos: str

model = genai.GenerativeModel("gemini-2.5-flash")


@app.post("/analise-clima")
async def analisar_clima(input_data: AnaliseClimaInput):
    """
    Expects a JSON with:
    {
        "cidade": "City name",
        "dados_climaticos": "Descriptive text with current conditions"
    }
    """
    try:
        # Assembles the final prompt
        prompt = f"""
            City: {input_data.cidade}
            Weather Conditions:
            {input_data.dados_climaticos}
            """

        response = model.generate_content(
            contents=ClimaPromptBase + "\n\n" + prompt,
        )

        return {
            "cidade": input_data.cidade,
            "analise": response.text  # .text to get the response text
        }

    except Exception as e:
        # Handles internal errors and returns a 500 JSON error
        raise HTTPException(
            status_code=500,
            detail=f"Error processing weather analysis: {str(e)}"
        )
