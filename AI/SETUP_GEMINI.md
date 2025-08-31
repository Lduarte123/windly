# 🔑 Configuração da API Gemini para Windly AI

## 📋 **Pré-requisitos**
- Conta Google ativa
- Acesso à internet
- Python 3.8+ instalado

## 🚀 **Passo a Passo para Obter a Chave da API**

### **1. Acesse o Google AI Studio**
- Vá para: [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
- Faça login com sua conta Google

### **2. Crie uma Nova Chave de API**
- Clique no botão **"Create API Key"**
- Uma nova chave será gerada automaticamente
- **IMPORTANTE**: Copie a chave imediatamente (ela só aparece uma vez!)

### **3. Configure o Arquivo .env**
```bash
# No diretório AI, edite o arquivo .env
GEMINI_API_KEY=AIzaSyC...sua_chave_aqui
```

**Exemplo completo do arquivo .env:**
```env
# Configurações da API Gemini
GEMINI_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz <-- exemplo -->

# Configurações do servidor
HOST=0.0.0.0
PORT=8000

# Configurações de segurança
CORS_ORIGINS=*

# Configurações da IA
MAX_TOKENS=1000
TEMPERATURE=0.7
```

## ⚠️ **Importante: Segurança da Chave**

- **NUNCA** compartilhe sua chave da API
- **NUNCA** commite o arquivo `.env` no Git
- **NUNCA** exponha a chave em código público
- A chave tem um limite de uso gratuito mensal

## 🧪 **Testando a Configuração**

### **1. Verifique se a chave está configurada:**
```bash
cd AI
python start.py
```

### **2. Teste o serviço:**
```bash
# Health check
curl http://localhost:8000/health

# Teste do chatbot
curl -X POST http://localhost:8000/api/ai/chatbot \
  -H "Content-Type: application/json" \
  -d '{"question": "Como está o clima hoje?"}'
```

## 🔍 **Verificando se Funcionou**

### **✅ Sucesso:**
- Logs mostram "✅ Cliente Gemini inicializado com sucesso"
- Respostas da IA são geradas dinamicamente
- Sem mensagens de "modo de demonstração"

### **❌ Problemas Comuns:**

#### **Chave inválida:**
```
❌ Erro ao inicializar cliente Gemini: Invalid API key
```
**Solução:** Verifique se a chave foi copiada corretamente

#### **Limite de uso excedido:**
```
❌ Erro ao gerar resposta: Quota exceeded
```
**Solução:** Aguarde o próximo mês ou atualize seu plano

#### **Erro de rede:**
```
❌ Erro ao gerar resposta: Network error
```
**Solução:** Verifique sua conexão com a internet

## 📱 **Para Dispositivos Móveis**

Se estiver testando no app React Native, substitua `localhost` pelo IP da sua máquina:

```javascript
const AI_API_BASE = 'http://192.168.1.100:8000/api/ai';
```

## 🎭 **Modo de Demonstração**

Se não configurar a chave da API, o serviço funcionará em modo de demonstração:
- Respostas simuladas pré-definidas
- Funcionalidades limitadas
- Útil para testes e desenvolvimento

## 🆘 **Precisa de Ajuda?**

1. **Verifique os logs** do serviço para detalhes do erro
2. **Confirme a chave** está correta no arquivo `.env`
3. **Teste a conectividade** com a internet
4. **Verifique o status** da API Gemini no Google AI Studio

## 🔗 **Links Úteis**

- [Google AI Studio](https://makersuite.google.com/app/apikey)
- [Documentação da API Gemini](https://ai.google.dev/docs)
- [Limites de uso gratuito](https://ai.google.dev/pricing)
- [Status da API](https://status.ai.google.dev/)

---

**💡 Dica:** Mantenha sua chave da API segura e nunca a compartilhe publicamente!

