async function menu(prefix) {
  return `
╭━━━━━━━━━━━━━━╮
┃ 🌸 *MENU PRINCIPAL* 🌸
╰━━━━━━━━━━━━━━╯

╭──────────────╮
│  📂 *Submenus disponíveis* 
├──────────────┤
│📥 *${prefix}menudown*
│  ➥ _Baixe músicas, vídeos, fotos_
│      _e muito mais!_
│🛠️ *${prefix}menuadm*
│  ➥ _Comandos de administração_
│      _e ativações do grupo_
│🎭 *${prefix}menubrincadeiras*
│  ➥ _Comandos de brincadeiras_
│      _e interações divertidas!_
│👑 *${prefix}menudono*
│  ➥ _Comandos exclusivos_
│      _para o dono do bot_
│🌟 *${prefix}menumembros*
│  ➥ _Comandos disponíveis_
│      _para todos os membros_
│⚒️ *${prefix}ferramentas*
│  ➥ _Algumas funções úteis_
│      _e funcionais_
│💫 *${prefix}menufig*
│  ➥ _Criar, baixar e modificar_
│      _suas figurinhas_
╰──────────────╯

╭━━━━━━━━━━━━━━╮
┃ 🌸 *Explore e Divirta-se!* 🌸
╰━━━━━━━━━━━━━━╯
`;
}

module.exports = menu;