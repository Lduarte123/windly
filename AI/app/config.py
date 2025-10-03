import os
from dotenv import load_dotenv

# Carrega as variáveis do arquivo .env
load_dotenv()

class Settings:
    # Configurações da API Gemini
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    
    # Configurações do servidor
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", 8000))
    
    # Configurações de segurança
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")
    
    # Configurações da IA
    MAX_TOKENS = int(os.getenv("MAX_TOKENS", 1000))
    TEMPERATURE = float(os.getenv("TEMPERATURE", 0.7))
    
    # Validação das configurações obrigatórias
    @classmethod
    def validate(cls):
        if not cls.GEMINI_API_KEY:
            print("⚠️ ATENÇÃO: GEMINI_API_KEY não configurada!")
            print("   O serviço funcionará em modo de demonstração")
            print("   Para usar a IA real, configure sua chave no arquivo .env")
            print("   Exemplo: GEMINI_API_KEY=sua_chave_aqui")
            print()
            # Não levanta erro, permite modo demo
            return cls
        
        print("✅ Configurações carregadas com sucesso!")
        return cls

# Instância global das configurações
settings = Settings.validate()
