async function menuadm(prefix) {
  return `
╭━━━━━━━━━━━━━━╮
┃     🛠️ *MENU DE ADM* 🛠️     
╰━━━━━━━━━━━━━━╯

╭──────────────╮
│🔧 *Comandos de Administração*
├──────────────┤
│ *${prefix}del* ou *${prefix}d*
│ *${prefix}hidetag*
│ *${prefix}marcar*
│ *${prefix}ban* ou *${prefix}b*
│ *${prefix}promover*
│ *${prefix}rebaixar*
│ *${prefix}mute*
│ *${prefix}desmute*
│ *${prefix}blockcmd*
│ *${prefix}unblockcmd*
│ *${prefix}linkgp*
│ *${prefix}grupo* A/F
│ *${prefix}setname*
│ *${prefix}setdesc*
╰──────────────╯

╭━━━━━━━━━━━━━━╮
┃  🌟 *Ativações disponíveis*
├──────────────┤
│ *${prefix}modobn*
│ *${prefix}modonsfw*
│ *${prefix}antilinkgp*
│ *${prefix}antiporn*
│ *${prefix}bemvindo* ou *${prefix}bv
│ *${prefix}soadm*
╰━━━━━━━━━━━━━━╯
`;
}

module.exports = menuadm;