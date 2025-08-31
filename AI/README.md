# 🌟 Windly AI Service

Serviço de Inteligência Artificial para o aplicativo Windly, especializado em meteorologia e clima.

## 🚀 Funcionalidades

### 1. **Chatbot Meteorológico** (`/api/ai/chatbot`)
- Responde perguntas sobre clima e meteorologia
- Fornece dicas baseadas em condições climáticas
- Contexto especializado em meteorologia

### 2. **Sugestão de Roupas** (`/api/ai/roupas`)
- Recomenda vestuário baseado no clima
- Considera temperatura, umidade e condições
- Sugestões para diferentes ocasiões

### 3. **Alertas Climáticos** (`/api/ai/alerta`)
- Gera alertas de segurança baseados em dados meteorológicos
- Níveis de risco (verde, amarelo, laranja, vermelho)
- Contatos de emergência por localização

## 🛠️ Tecnologias

- **FastAPI** - Framework web moderno e rápido
- **Google Generative AI (Gemini)** - Modelo de linguagem avançado
- **Python 3.8+** - Linguagem principal
- **Pydantic** - Validação de dados
- **Uvicorn** - Servidor ASGI

## 📁 Estrutura do Projeto

```
AI/
├── app/
│   ├── main.py              # Aplicação principal FastAPI
│   ├── config.py            # Configurações e variáveis de ambiente
│   ├── gemini/
│   │   └── client.py        # Cliente para API Gemini
│   └── features/
│       ├── alerta/          # Funcionalidade de alertas
│       ├── searchbar/       # Funcionalidade de chatbot
│       └── sugestao_roupas/ # Funcionalidade de roupas
├── requirements.txt          # Dependências Python
├── env.example              # Exemplo de variáveis de ambiente
└── README.md                # Esta documentação
```

## 🚀 Instalação e Configuração

### 1. **Clone e Setup**
```bash
cd AI
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows
```

### 2. **Instalar Dependências**
```bash
pip install -r requirements.txt
```

### 3. **Configurar Variáveis de Ambiente**
```bash
cp env.example .env
# Edite o arquivo .env com sua chave da API Gemini
```

### 4. **Executar o Serviço**
```bash
cd app
python main.py
```

O serviço estará disponível em `http://localhost:8000`

## 🔑 Configuração da API Gemini

1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crie uma nova chave de API
3. Adicione a chave no arquivo `.env`:
```env
GEMINI_API_KEY=sua_chave_aqui
```

## 📡 Endpoints da API

### **Chatbot** (`/api/ai/chatbot`)
```http
POST /api/ai/chatbot
Content-Type: application/json

{
  "question": "Como está o clima hoje?",
  "context": "Contexto adicional (opcional)"
}
```

### **Sugestão de Roupas** (`/api/ai/roupas/outfit`)
```http
POST /api/ai/roupas/outfit
Content-Type: application/json

{
  "weather_data": {
    "temperature": 25.0,
    "condition": "ensolarado",
    "humidity": 60,
    "wind": "leve"
  },
  "occasion": "trabalho"
}
```

### **Alertas Climáticos** (`/api/ai/alerta/weather`)
```http
POST /api/ai/alerta/weather
Content-Type: application/json

{
  "temperature": 35.0,
  "condition": "ensolarado",
  "humidity": 80,
  "location": "São Paulo, SP"
}
```

## 🔧 Desenvolvimento

### **Adicionando Nova Funcionalidade**
1. Crie um novo diretório em `features/`
2. Implemente `prompt.py`, `service.py` e `controller.py`
3. Adicione o router em `main.py`
4. Teste a funcionalidade

### **Estrutura de uma Feature**
```python
# prompt.py - Prompts para a IA
FEATURE_PROMPT = "..."

# service.py - Lógica de negócio
class FeatureService:
    async def process_request(self, data):
        # Lógica aqui
        pass

# controller.py - Endpoints HTTP
@router.post("/feature")
async def feature_endpoint(request: RequestModel):
    # Endpoint aqui
    pass
```

## 🧪 Testes

### **Teste Manual**
```bash
# Teste de saúde
curl http://localhost:8000/health

# Teste do chatbot
curl -X POST http://localhost:8000/api/ai/chatbot \
  -H "Content-Type: application/json" \
  -d '{"question": "Como está o clima?"}'
```

### **Teste com Swagger**
Acesse `http://localhost:8000/docs` para documentação interativa da API.

## 🚨 Troubleshooting

### **Erro de Conexão com Gemini**
- Verifique se a chave da API está correta
- Confirme se há conexão com a internet
- Verifique os logs para detalhes do erro

### **Erro de CORS**
- O serviço está configurado para aceitar todas as origens
- Em produção, configure `CORS_ORIGINS` adequadamente

### **Erro de Dependências**
- Ative o ambiente virtual: `source venv/bin/activate`
- Reinstale as dependências: `pip install -r requirements.txt`

## 📱 Integração com Frontend

### **React Native/Expo**
```javascript
const sendToAI = async (question) => {
  try {
    const response = await fetch('http://localhost:8000/api/ai/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Erro na API:', error);
  }
};
```

### **Configuração de IP**
Para dispositivos móveis, substitua `localhost` pelo IP da sua máquina na rede local.

## 🔒 Segurança

- **Em produção**: Configure `CORS_ORIGINS` adequadamente
- **Rate Limiting**: Considere implementar limitação de requisições
- **Autenticação**: Adicione autenticação se necessário
- **Logs**: Monitore os logs para atividades suspeitas

## 📈 Monitoramento

### **Logs**
O serviço gera logs detalhados para:
- Requisições recebidas
- Respostas da IA
- Erros e exceções
- Performance

### **Métricas**
- Tempo de resposta da IA
- Taxa de sucesso das requisições
- Uso de tokens da API

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Implemente as mudanças
4. Teste adequadamente
5. Envie um Pull Request

## 📄 Licença

Este projeto faz parte do Windly e está sob a mesma licença.

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no repositório
- Consulte a documentação da API em `/docs`
- Verifique os logs do serviço

---

**Desenvolvido com ❤️ para o Windly** 🌪️
