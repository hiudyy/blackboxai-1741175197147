#!/bin/bash

# Funções para exibir mensagens formatadas
mensagem() {
    echo "\033[1;32m$1\033[0m"
}

aviso() {
    echo "\033[1;31m$1\033[0m"
}

separador() {
    echo "\033[1;34m============================================\033[0m"
}

# Início da atualização
separador
mensagem "🔄 Iniciando atualização do Nazuninha Bot..."
separador

# Cria um diretório temporário para o backup
backup_dir="./backup_temp"
mkdir -p "$backup_dir/dados/database"
mkdir -p "$backup_dir/dados/src"
mkdir -p "$backup_dir/dados/midias"

# Faz o backup dos dados importantes
mensagem "📂 Fazendo backup dos dados..."
cp -r "./dados/database" "$backup_dir/dados/"
cp "./dados/src/config.json" "$backup_dir/dados/src/"
cp -r "./dados/midias/"* "$backup_dir/dados/midias/" 2>/dev/null
mensagem "✔ Backup concluído!"

# Baixa a versão mais recente do repositório
mensagem "⬇️ Baixando a versão mais recente do repositório..."
git clone https://github.com/hiudyy/nazuninha-bot.git ./temp_nazuninha
if [ $? -ne 0 ]; then
    aviso "❌ Falha ao baixar o repositório. Verifique sua conexão com a internet."
    exit 1
fi

# Remove o README.md (caso queira evitar o arquivo)
rm -f ./temp_nazuninha/README.md

# Remove todos os arquivos e diretórios antigos, exceto a pasta backup_temp
mensagem "🧹 Limpando arquivos antigos..."
rm -rf .git package.json package-lock.json
find dados/ -mindepth 1 ! -path "backup_temp/*" -exec rm -rf {} +

# Move os novos arquivos para o diretório atual
mensagem "🚚 Movendo novos arquivos..."
mv ./temp_nazuninha/* ./
mv ./temp_nazuninha/.git ./

# Remove a pasta temporária do repositório clonado
rm -rf ./temp_nazuninha

# Restaura os dados do backup
mensagem "🔄 Restaurando dados do backup..."
mkdir -p "./dados/database"
mkdir -p "./dados/src"
mkdir -p "./dados/midias"

cp -r "$backup_dir/dados/database" "./dados/"
cp "$backup_dir/dados/src/config.json" "./dados/src/"

# Restaura os arquivos antigos da pasta 'midias' e substitui os que já existem
mensagem "🖼 Restaurando arquivos antigos na pasta 'midias'..."
cp -rf "$backup_dir/dados/midias/"* "./dados/midias/"
mensagem "✔ Arquivos restaurados com sucesso!"

# Remove a pasta de backup temporária
rm -rf "$backup_dir"

# Instala as dependências do Node.js
mensagem "📦 Instalando dependências do Node.js..."
npm install --no-bin-links --force
if [ $? -ne 0 ]; then
    aviso "❌ Falha ao instalar as dependências. Verifique o arquivo package.json."
    exit 1
fi
mensagem "✔ Dependências instaladas com sucesso!"

# Mensagem final
separador
mensagem "🎉 Atualização concluída com sucesso!"
mensagem "🚀 Inicie o bot com: npm start"
separador