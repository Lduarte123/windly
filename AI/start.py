#!/usr/bin/env python3
"""
Script de inicialização do Windly AI Service
"""

import os
import sys
import subprocess
import time
from pathlib import Path

def check_python_version():
    """Verifica se a versão do Python é compatível"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ é necessário")
        print(f"Versão atual: {sys.version}")
        return False
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detectado")
    return True

def check_venv():
    """Verifica se o ambiente virtual está ativo"""
    if hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print("✅ Ambiente virtual ativo")
        return True
    else:
        print("⚠️ Ambiente virtual não detectado")
        print("Recomendado: ative o ambiente virtual primeiro")
        return False

def check_dependencies():
    """Verifica se as dependências estão instaladas"""
    try:
        import fastapi
        import uvicorn
        import dotenv
        print("✅ Todas as dependências estão instaladas")
        return True
    except ImportError as e:
        print(f"❌ Dependência não encontrada: {e}")
        print("Execute: pip install -r requirements.txt")
        return False

def check_env_file():
    """Verifica se o arquivo .env existe e se tem a chave da API"""
    env_path = Path(".env")
    if not env_path.exists():
        print("⚠️ Arquivo .env não encontrado")
        print("Copie env.example para .env e configure sua chave da API Gemini")
        return False
    
    # Verifica se a chave da API está configurada
    try:
        from dotenv import load_dotenv
        load_dotenv()
        api_key = os.getenv("GEMINI_API_KEY")
        
        if api_key and api_key != "sua_chave_api_gemini_aqui":
            print("✅ Arquivo .env encontrado com chave da API configurada")
            return True
        else:
            print("⚠️ Arquivo .env encontrado, mas GEMINI_API_KEY não configurada")
            print("   O serviço funcionará em modo de demonstração")
            print("   Para usar a IA real, configure sua chave no arquivo .env")
            return False
    except Exception as e:
        print(f"⚠️ Erro ao verificar arquivo .env: {e}")
        return False

def start_service():
    """Inicia o serviço"""
    print("\n🚀 Iniciando Windly AI Service...")
    
    # Navega para o diretório app
    app_dir = Path("app")
    if not app_dir.exists():
        print("❌ Diretório 'app' não encontrado")
        return False
    
    os.chdir(app_dir)
    
    try:
        # Inicia o serviço
        print("📍 Serviço iniciando em http://localhost:8000")
        print("📚 Documentação: http://localhost:8000/docs")
        print("🔍 Health check: http://localhost:8000/health")
        
        # Verifica se está em modo demo
        from dotenv import load_dotenv
        load_dotenv()
        api_key = os.getenv("GEMINI_API_KEY")
        
        if not api_key or api_key == "sua_chave_api_gemini_aqui":
            print("\n🎭 MODO DE DEMONSTRAÇÃO ATIVADO")
            print("   - Respostas simuladas da IA")
            print("   - Funcionalidades limitadas")
            print("   - Configure GEMINI_API_KEY para IA real")
        
        print("\nPressione Ctrl+C para parar o serviço")
        
        subprocess.run([sys.executable, "main.py"], check=True)
        
    except KeyboardInterrupt:
        print("\n\n🛑 Serviço parado pelo usuário")
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Erro ao iniciar o serviço: {e}")
        return False
    except Exception as e:
        print(f"\n❌ Erro inesperado: {e}")
        return False
    
    return True

def main():
    """Função principal"""
    print("🌟 Windly AI Service - Verificação de Sistema")
    print("=" * 50)
    
    # Verificações do sistema
    checks = [
        ("Versão do Python", check_python_version),
        ("Ambiente Virtual", check_venv),
        ("Dependências", check_dependencies),
        ("Arquivo .env", check_env_file),
    ]
    
    all_passed = True
    for check_name, check_func in checks:
        print(f"\n🔍 Verificando {check_name}...")
        if not check_func():
            if check_name == "Arquivo .env":
                # Para .env, não é crítico se estiver em modo demo
                print("   Continuando em modo de demonstração...")
            else:
                all_passed = False
    
    if not all_passed:
        print("\n❌ Algumas verificações críticas falharam")
        print("Corrija os problemas antes de continuar")
        return 1
    
    print("\n✅ Sistema pronto para iniciar!")
    
    # Pergunta se deve iniciar o serviço
    try:
        response = input("\n🚀 Deseja iniciar o serviço agora? (s/N): ").strip().lower()
        if response in ['s', 'sim', 'y', 'yes']:
            return start_service()
        else:
            print("👋 Serviço não iniciado. Execute 'python start.py' quando quiser.")
            return 0
    except KeyboardInterrupt:
        print("\n\n👋 Operação cancelada pelo usuário")
        return 0

if __name__ == "__main__":
    sys.exit(main())
