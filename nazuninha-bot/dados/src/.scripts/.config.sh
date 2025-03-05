#!/bin/sh

# Função para exibir mensagens formatadas
mensagem() {
    echo "\033[1;32m$1\033[0m"
}

aviso() {
    echo "\033[1;31m$1\033[0m"
}

separador() {
    echo "\033[1;34m============================================\033[0m"
}

# Verifica se o script foi executado com --install
if [ "$1" = "--install" ]; then
    separador
    mensagem "📦 Instalando dependências..."
    npm install --no-bin-links --force
    mensagem "✔ Instalação concluída! Rode 'npm start' para iniciar o bot."
    exit 0
fi

# Obtém a versão do package.json
versao=$(jq -r .version package.json 2>/dev/null || echo "Desconhecida")

# Caminho do arquivo de configuração
arquivo="./dados/src/config.json"

# Carrega os valores atuais do JSON (se existir)
if [ -f "$arquivo" ]; then
    nomedono=$(jq -r .nomedono "$arquivo")
    numerodono=$(jq -r .numerodono "$arquivo")
    nomebot=$(jq -r .nomebot "$arquivo")
    prefixo=$(jq -r .prefixo "$arquivo")
    aviso=$(jq -r .aviso "$arquivo")
    debug=$(jq -r .debug "$arquivo")
    enablePanel=$(jq -r .enablePanel "$arquivo")
    panelPort=$(jq -r .panelPort "$arquivo")
else
    nomedono=""
    numerodono=""
    nomebot=""
    prefixo=""
    aviso="false"
    debug="false"
    enablePanel="false"
    panelPort="2012"
fi

# Exibe o cabeçalho
separador
mensagem "   🔧 Configurador da Nazuna 🔧        "
mensagem "   🚀 Criado por Hiudy - Versão: $versao 🚀"
separador
echo ""

# Termos de uso
aviso "⚠ ATENÇÃO! Antes de continuar, leia atentamente os termos:"
echo "\033[1;33m1.\033[0m Nunca remover os créditos do criador do Bot."
echo "\033[1;33m2.\033[0m Nunca vender os arquivos deste projeto."
echo "\033[1;33m3.\033[0m Usar o Bot de forma ética e responsável."
echo ""

# Pergunta se o usuário aceita os termos
echo "Você concorda com os termos acima? (sim/não)"
read concorda

# Converte a resposta para minúsculas
concorda=$(echo "$concorda" | tr '[:upper:]' '[:lower:]')

# Verifica a resposta
if [ "$concorda" != "sim" ]; then
    aviso "❌ Instalação cancelada. Você precisa concordar com os termos para continuar."
    exit 1
fi

mensagem "✔ Termos aceitos! Continuando a configuração..."
echo ""

# Perguntas ao usuário (com valores padrão)
echo "👤 Qual seu nome? (Atual: $nomedono)"
read nome
nome=${nome:-$nomedono}
mensagem "✔ Nome registrado: $nome"

echo "📞 Qual seu número (número dono)? (Atual: $numerodono)"
read numero
numero=${numero:-$numerodono}
mensagem "✔ Número registrado: $numero"

echo "🤖 Qual o nome do seu Bot? (Atual: $nomebot)"
read nomebotnovo
nomebot=${nomebotnovo:-$nomebot}
mensagem "✔ Nome do Bot registrado: $nomebot"

echo "⚙️  Qual o prefixo do Bot (1 caractere)? (Atual: $prefixo)"
read prefixonovo
prefixo=${prefixonovo:-$prefixo}
mensagem "✔ Prefixo registrado: $prefixo"

# Pergunta se o usuário deseja receber o aviso quando o bot ligar
echo "📲 Você deseja receber uma notificação quando o bot ligar? (S/n)"
read aviso_ao_ligar

# Converte a resposta para minúsculas
aviso_ao_ligar=$(echo "$aviso_ao_ligar" | tr '[:upper:]' '[:lower:]')

# Define o valor para "aviso" como true ou false
if [ -z "$aviso_ao_ligar" ] || [ "$aviso_ao_ligar" = "s" ]; then
    aviso="true"
else
    aviso="false"
fi

# Pergunta se o usuário quer enviar os bugs ao criador
echo "🛠️ Você deseja enviar os bugs que ocorrerem para o criador do bot? (S/n)"
read envia_bugs

# Converte a resposta para minúsculas
envia_bugs=$(echo "$envia_bugs" | tr '[:upper:]' '[:lower:]')

# Define o valor para "debug" como true ou false
if [ -z "$envia_bugs" ] || [ "$envia_bugs" = "s" ]; then
    debug="true"
else
    debug="false"
fi

# Pergunta se o usuário quer ativar o painel web
echo "🌐 Você deseja ativar o painel web do bot? (S/n)"
read ativar_painel

# Converte a resposta para minúsculas
ativar_painel=$(echo "$ativar_painel" | tr '[:upper:]' '[:lower:]')

# Define o valor para "enablePanel" como true ou false
if [ -z "$ativar_painel" ] || [ "$ativar_painel" = "s" ]; then
    enablePanel="true"
    # Se o painel estiver ativado, pergunta a porta
    echo "🔌 Em qual porta você deseja que o painel rode? (Atual: $panelPort)"
    read porta_painel
    panelPort=${porta_painel:-$panelPort}
    mensagem "✔ Porta do painel registrada: $panelPort"
else
    enablePanel="false"
fi

# Cria o diretório caso não exista
mkdir -p "$(dirname "$arquivo")"

# Adiciona a configuração ao arquivo JSON
cat > "$arquivo" <<EOL
{
  "nomedono": "$nome",
  "numerodono": "$numero",
  "nomebot": "$nomebot",
  "prefixo": "$prefixo",
  "aviso": $aviso,
  "debug": $debug,
  "enablePanel": $enablePanel,
  "panelPort": $panelPort
}
EOL

# Mensagem final
separador
mensagem "🎉 Configuração concluída com sucesso!"
separador

# Pergunta sobre a instalação dos módulos
echo "Deseja instalar as dependências agora? (S/n)"
read instalar

# Se pressionar apenas Enter, assume "s"
instalar=$(echo "$instalar" | tr '[:upper:]' '[:lower:]')
if [ -z "$instalar" ] || [ "$instalar" = "s" ]; then
    mensagem "📦 Instalando dependências..."
    npm install --no-bin-links --force
    mensagem "✔ Instalação concluída! Rode 'npm start' para iniciar o bot."
else
    mensagem "⚡ Instalação dos módulos pulada. Para instalar depois, rode:"
    mensagem "   npm run config:install"
fi

separador
mensagem "    🚀 Criado por Hiudy - Versão: $versao 🚀"
separador
