//Criador: hiudy
//Versão: 0.0.1
//Esse arquivo contem direitos autorais, caso meus creditos sejam tirados poderei tomar medidas jurídicas.

const { downloadContentFromMessage, Mimetype } = require('baileys');
const panel = require('./.funcs/.panel/.server');
const { exec, spawn, execSync } = require('child_process');
const { reportError, youtube, tiktok, pinterest, igdl, sendSticker, FilmesDL, styleText, emojiMix, upload, mcPlugin }  = require(__dirname+'/.funcs/.exports.js');
const { menu, menudown, menuadm, menubn, menuDono, menuMembros, menuFerramentas, menuSticker, menuIa } = require(__dirname+'/menus/index.js');
const FormData = require("form-data");
const axios = require('axios');
const pathz = require('path');
const fs = require('fs');

async function NazuninhaBotExec(nazu, info) {
const { numerodono, nomedono, nomebot, prefixo, prefixo: prefix, debug, enablePanel } = JSON.parse(fs.readFileSync(__dirname+'/config.json'));

// Update panel stats for received message
if (enablePanel) {
    const statsPath = __dirname + '/../database/panel/stats.json';
    if (fs.existsSync(statsPath)) {
        const stats = JSON.parse(fs.readFileSync(statsPath));
        stats.messagesReceived++;
        fs.writeFileSync(statsPath, JSON.stringify(stats));
    }
}
try {
 const from = info.key.remoteJid;
 const isGroup = from.endsWith('@g.us');
 const sender = isGroup ? info.key.participant.includes(':') ? info.key.participant.split(':')[0] +'@s.whatsapp.net': info.key.participant : info.key.remoteJid;
 const isStatus = from.endsWith('@broadcast');
 const nmrdn = numerodono.replace(new RegExp("[()+-/ +/]", "gi"), "") + `@s.whatsapp.net`
 const isOwner = (nmrdn == sender ? true : false) || info.key.fromMe;
 
 const baileys = require('baileys');
 const type = baileys.getContentType(info.message);
 
 const isImage = type == 'imageMessage'
 const isVideo = type == 'videoMessage'
 const isVisuU2 = type == 'viewOnceMessageV2'
 const isVisuU = type == 'viewOnceMessage'
 
 const pushname = info.pushName ? info.pushName : '';
 
 var body = info.message?.conversation || info.message?.viewOnceMessageV2?.message?.imageMessage?.caption || info.message?.viewOnceMessageV2?.message?.videoMessage?.caption || info.message?.imageMessage?.caption || info.message?.videoMessage?.caption || info.message?.extendedTextMessage?.text || info.message?.viewOnceMessage?.message?.videoMessage?.caption || info.message?.viewOnceMessage?.message?.imageMessage?.caption || info.message?.documentWithCaptionMessage?.message?.documentMessage?.caption || info.message?.editedMessage?.message?.protocolMessage?.editedMessage?.extendedTextMessage?.text || info.message?.editedMessage?.message?.protocolMessage?.editedMessage?.imageMessage?.caption || info?.text || '';
 
 const args = body.trim().split(/ +/).slice(1);
 const q = args.join(' ');
 const budy2 = body.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
 const menc_prt = info.message?.extendedTextMessage?.contextInfo?.participant;
 const menc_jid = args?.join(" ").replace("@", "") + "@s.whatsapp.net";
 const menc_jid2 = info.message?.extendedTextMessage?.contextInfo?.mentionedJid;
 const menc_os2 = q.includes("@") ? menc_jid : menc_prt;
 const sender_ou_n = q.includes("@") ? menc_jid : menc_prt ? menc_prt : sender;

 var isCmd = body.trim().startsWith(prefix);
 const command = isCmd ? budy2.trim().slice(1).split(/ +/).shift().toLocaleLowerCase().trim().replaceAll(' ', '') : null;
 
 // Update panel stats for commands
 if (enablePanel && isCmd) {
    const statsPath = __dirname + '/../database/panel/stats.json';
    if (fs.existsSync(statsPath)) {
        const stats = JSON.parse(fs.readFileSync(statsPath));
        stats.commandsExecuted++;
        fs.writeFileSync(statsPath, JSON.stringify(stats));
    }
 }
 
 //CRIAR PASTAS
  if (!fs.existsSync(__dirname + `/../database/grupos`)) fs.mkdirSync(__dirname + `/../database/grupos`, { recursive: true });
  if (!fs.existsSync(__dirname + `/../database/users`)) fs.mkdirSync(__dirname + `/../database/users`, { recursive: true });
  if (!fs.existsSync(__dirname + `/../database/dono`)) fs.mkdirSync(__dirname + `/../database/dono`, { recursive: true });
  
 //SISTEMA DE PREMIUM
 if (!fs.existsSync(__dirname + `/../database/dono/premium.json`)) fs.writeFileSync(__dirname + `/../database/dono/premium.json`, JSON.stringify({}, null, 2));
 const premiumListaZinha = JSON.parse(fs.readFileSync(__dirname + `/../database/dono/premium.json`, 'utf-8'));
 const isPremium = !!premiumListaZinha[sender] || isOwner;
 
 //BAN GPS
 if (!fs.existsSync(__dirname + `/../database/dono/bangp.json`)) fs.writeFileSync(__dirname + `/../database/dono/bangp.json`, JSON.stringify({}, null, 2));
 const banGpIds = JSON.parse(fs.readFileSync(__dirname + `/../database/dono/bangp.json`, 'utf-8'));
 if(!!banGpIds[from] && !isOwner && !isPremium) return;
 
 //INFOS DE GRUPO
  const groupMetadata = !isGroup ? {} : await nazu.groupMetadata(from);
  const groupName = isGroup ? groupMetadata.subject : '';
  const AllgroupMembers = !isGroup ? [] : groupMetadata.participants.map(p => p.id);
  const groupAdmins = !isGroup ? [] : groupMetadata.participants.filter(p => p.admin).map(p => p.id);
  const botNumber = nazu.user.id.split(':')[0] + '@s.whatsapp.net';
  const isGroupAdmin = !isGroup ? null : groupAdmins.includes(sender) || isOwner;
  const isBotAdmin = !isGroup ? null : groupAdmins.includes(botNumber);
  if(isGroup) {
  if (!fs.existsSync(__dirname + `/../database/grupos/${from}.json`)) fs.writeFileSync(__dirname + `/../database/grupos/${from}.json`, JSON.stringify({ mark: {} }, null, 2));
  };
  let groupData = {};
  try {groupData = JSON.parse(fs.readFileSync(__dirname + `/../database/grupos/${from}.json`));} catch (error) {};
  const isModoBn = groupData.modobrincadeira ? true : false;
  const isOnlyAdmin = groupData.soadm ? true : false;
  const isAntiPorn = groupData.antiporn ? true : false;
  const isMuted = (groupData.mutedUsers && groupData.mutedUsers[sender]) ? true : false;
  const isAntiLinkGp = groupData.antilinkgp ? true : false;
  if(isGroup && !isGroupAdmin && isOnlyAdmin) return;
  if(isGroup && !isGroupAdmin && isCmd && groupData.blockedCommands && groupData.blockedCommands[command]) return reply('Este comando foi bloqueado pelos administradores do grupo.');
  
 //BANIR USUÁRIOS MUTADOS 🤓☝🏻
 if(isGroup && isMuted) {
 await nazu.sendMessage(from, {text: `🤫 Hmm @${sender.split("@")[0]}, achou que ia passar despercebido? Achou errado lindo(a)! Você está sendo removido por enviar mensagem, sendo que você está mutado neste grupo.`, mentions: [sender]}, {quoted: info});
 await nazu.sendMessage(from, {delete: {remoteJid: from, fromMe: false, id: info.key.id, participant: sender}});
 await nazu.groupParticipantsUpdate(from, [sender], 'remove');
 delete groupData.mutedUsers[sender];
 fs.writeFileSync(__dirname + `/../database/grupos/${from}.json`, JSON.stringify(groupData, null, 2));
 };
 //FIM
 
 //CONTADOR DE MENSAGEM 🤓
 if(isGroup) {
 if(!groupData.contador) groupData.contador = [];
  if(JSON.stringify(groupData.contador).includes(sender)) {
  const i2 = groupData.contador.map(i => i.id).indexOf(sender);
  if(isCmd && groupData.contador[i2].cmd) {groupData.contador[i2].cmd++} else if(type=="stickerMessage" && groupData.contador[i2].figu) {groupData.contador[i2].figu++} else if(groupData.contador[i2].msg) {groupData.contador[i2].msg++};
  // Update pushname if it changed
  if (pushname && groupData.contador[i2].pushname !== pushname) {
    groupData.contador[i2].pushname = pushname;
  }
  fs.writeFileSync(__dirname + `/../database/grupos/${from}.json`, JSON.stringify(groupData, null, 2));
 } else {
  groupData.contador.push({
    id: sender,
    msg: isCmd ? 0 : 1,
    cmd: isCmd ? 1 : 0,
    figu: type == "stickerMessage" ? 1 : 0,
    pushname: pushname || 'Unknown User'
  });
  fs.writeFileSync(__dirname + `/../database/grupos/${from}.json`, JSON.stringify(groupData, null, 2));
 }};
 //FIM DO CONTADOR
 
 //FUNÇÕES BASICAS
 async function reply(text) { 
    const result = await nazu.sendMessage(from, {text: text.trim()}, {sendEphemeral: true, contextInfo: { forwardingScore: 50, isForwarded: true, externalAdReply: { showAdAttribution: true }}, quoted: info});
    
    // Update panel stats for sent message
    if (enablePanel) {
        const statsPath = path.join(__dirname, '..', 'database', 'panel', 'stats.json');
        try {
            let stats = { messagesSent: 0 };
            if (fs.existsSync(statsPath)) {
                stats = JSON.parse(fs.readFileSync(statsPath));
            }
            stats.messagesSent = (stats.messagesSent || 0) + 1;
            fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));
        } catch (e) {
            console.error('Error updating stats:', e);
        }
    }
    
    return result;
 };
 nazu.reply=reply;
 
 const reagir = async (emj) => { if (typeof emj === 'string') { await nazu.sendMessage(from, { react: { text: emj, key: info.key } }); } else if (Array.isArray(emj)) { for (const emjzin of emj) { await nazu.sendMessage(from, { react: { text: emjzin, key: info.key } }); await new Promise(res => setTimeout(res, 500)); } } }; nazu.react = reagir;
 
 const getFileBuffer = async (mediakey, MediaType) => {const stream = await downloadContentFromMessage(mediakey, MediaType);let buffer = Buffer.from([]);for await(const chunk of stream) {buffer = Buffer.concat([buffer, chunk]) };return buffer}
 //FIM FUNÇÕES BASICAS

 //SISTEMA ANTI PORNOGRAFIA 🤫
 if (isGroup && isAntiPorn && (isImage || isVisuU || isVisuU2)) { const midiaz = info.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || info.message?.videoMessage || info.message?.stickerMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage; if (midiaz) { try { const stream = await getFileBuffer(midiaz, "image"); const mediaURL = await upload(stream, true); if (mediaURL) { const apiResponse = await axios.get(`https://nsfw-demo.sashido.io/api/image/classify?url=${mediaURL}`); const { Porn, Hentai } = apiResponse.data.reduce((acc, item) => ({...acc,[item.className]: item.probability}), {}); let userMessage = ''; let actionTaken = false; if (Porn > 0.80 || Hentai > 0.80) { if(!isGroupAdmin) { await nazu.sendMessage(from, { delete: info.key }); userMessage = `🚫 @${sender.split('@')[0]} foi removido por compartilhar conteúdo impróprio.\n\n🚫 Esta mídia contém conteúdo adulto (${apiResponse.data[0].className}) com uma probabilidade de ${apiResponse.data[0].probability.toFixed(2)} e foi removida!`; await nazu.groupParticipantsUpdate(from, [sender], "remove"); actionTaken = true; } else { await nazu.sendMessage(from, { delete: info.key }); await reply('Conteudo adulto detectado, porem como você é um administrador não irei banir.'); } } if (actionTaken) { await nazu.sendMessage(from, { text: userMessage, mentions: [sender] }, { quoted: info }); }; } } catch (error) { } } };
 //FIM 🤫
 
 //DEFINIÇÕES DE ISQUOTED
 const content = JSON.stringify(info.message);
 const isQuotedMsg = type === 'extendedTextMessage' && content.includes('conversation')
 const isQuotedMsg2 = type === 'extendedTextMessage' && content.includes('text')
 const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
 const isQuotedVisuU = type === 'extendedTextMessage' && content.includes('viewOnceMessage')
 const isQuotedVisuU2 = type === 'extendedTextMessage' && content.includes('viewOnceMessageV2')
 const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
 const isQuotedDocument = type === 'extendedTextMessage' && content.includes('documentMessage')
 const isQuotedDocW = type === 'extendedTextMessage' && content.includes('documentWithCaptionMessage')
 const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
 const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
 const isQuotedContact = type === 'extendedTextMessage' && content.includes('contactMessage')
 const isQuotedLocation = type === 'extendedTextMessage' && content.includes('locationMessage')
 const isQuotedProduct = type === 'extendedTextMessage' && content.includes('productMessage')
 
 //EXECUÇÕES DE DONO BBZIN 🥵
 if(body.startsWith('$')) {if(!isOwner) return;exec(q, (err, stdout) => {if(err) return reply(`${err}`);if(stdout) {reply(stdout);}})};
 
 if(body.startsWith('>>')){try { if(!isOwner) return;(async () => {try {const codeLines = body.slice(2).trim().split('\n');if (codeLines.length > 1) {codeLines[codeLines.length - 1] = 'return ' + codeLines[codeLines.length - 1];} else {codeLines[0] = 'return ' + codeLines[0];};const result = await eval(`(async () => { ${codeLines.join('\n')} })()`);let output;if (typeof result === 'object' && result !== null) {output = JSON.stringify(result, null, '\t');} else if (typeof result === 'function') {output = result.toString();} else {output = String(result);};return reply(output).catch(e => reply(String(e)));} catch (e) {return reply(String(e));};})();} catch (e){return reply(String(e));}};
 //FIM DAS EXECUÇÕES BB 🥵
 
 //ANTILINK DE GRUPOS :)
 if(isGroup && isAntiLinkGp && !isGroupAdmin && budy2.includes('chat.whatsapp.com') && isGroupAdmin) {
  if(isOwner) return;
  link_dgp = await nazu.groupInviteCode(from);
  if(budy2.match(link_dgp)) return;
  nazu.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender}});
  if(!JSON.stringify(AllgroupMembers).includes(sender)) return;
  nazu.groupParticipantsUpdate(from, [sender], 'remove');
 };
 //FIM :)
 
 //LOGS AQUI BBZIN <3
 console.log(`=========================================`);
 console.log(`${isCmd ? '⚒️ Comando' : '🗨️ Mensagem'} ${isGroup ? 'em grupo 👥' : 'no privado 👤'}`);
 console.log(`${isCmd ? '⚒️ Comando' : '🗨️ Mensagem'}: "${isCmd ? prefix+command : budy2.substring(0, 12)+'...'}"`);
 console.log(`${isGroup ? '👥 Grupo' : '👤 Usuario'}: "${isGroup ? groupName : pushname}"`);
 console.log(`${isGroup ? '👤 Usuario' : '📲 Numero'}: "${isGroup ? pushname : sender.split('@')[0]}"`);
 console.log(`=========================================`);
 //FIM DOS LOGS
 
 //PEGAR IMAGEM DO PERFIL
 let ppimg = "";
 try {
 ppimg = await nazu.profilePictureUrl(sender, 'image');
 } catch {
 ppimg = 'https://telegra.ph/file/b5427ea4b8701bc47e751.jpg'
 };
 
 switch(command) {
 //FUNÇÕES PREMIUM
  case 'nome':case 'nome2':case 'nome3':case 'nome4':case 'telefone2':case 'telefonefixo':case 'cpf':case 'cpf2':case 'cpf3':case 'cpf4':case 'cpf5':case 'placa':case 'bin':case 'site':case 'cep':case 'vizinhos':case 'cnpj':case 'score':case 'titulo':case 'email':case 'vacina':case 'parentes':case 'rg':case 'rg2':case 'senha':case 'mae':case 'pai':case 'chassi':case 'motor':case 'beneficios':case 'impostos':case 'nascimento':case 'pfix':case 'cns':case 'cns2':case 'correios':case 'radar':case 'dominio':case 'internet':case 'compras':case 'cnh':case 'funcionarios': try {
  if (!isPremium) return reply('❌ Apenas usuários premium.');
  if (!q) return reply(`❌ Tá faltando os dados.`);
  nazu.react('🔎');
  const dados = (await axios.get(`https://blacksystemofc.com.br/vip/consultas?type=${command}&query=${q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll('-', '').replaceAll('+', '').replaceAll('.', '')}&apikey=827640_black_sim`)).data;
  if (dados.file) return await nazu.sendMessage(from, { document: Buffer.from(dados.base64, 'base64'), fileName: `${q}.txt`, mimetype: 'text/plain' }, { quoted: info });
  if (dados.resultado) return await reply(dados.resultado.replace(/\*\*|`/g, '').replace(/• USUÁRIO:.+\n/g, '').replace(/• BY:.+\n/g, '').replace(/• Grupo:.+\n/g, '').replace(/👤 USUÁRIO:.+\n/g, '').replace(/🤖 BY:.+\n/g, '').replace(/✅ Grupo:.+\n/g, '').replace(/👤\s*USUÁRIO:.+\n/g, '').replace(/🤖\s*BY:.+\n/g, '').replace(/✅\s*Grupo:.+\n/g, '').replace(/^[^\n]*✅ Grupo:[^\n]*\n?/gm, '').replace(/✅ Canal: @[\w\d]+/g, '') + `\n\n🤖 By: ${nomebot}\n📲 Dono: wa.me/${nmrdn.split('@')[0]}`);
  await reply('❌ Nenhum dado encontrado.');
  } catch (error) {
  console.error(error);
  reply('❌ Ocorreu um erro ao buscar os dados.');
  };
  break;
 
  //INTELIGENCIA ARTIFICIAL
  case 'simi': try {
  if(!q) return reply('🤔 Cadê o texto?')
  datasimi = await axios.post(`https://api.simsimi.vn/v1/simtalk`, "text="+q+"&lc=pt", {headers: {'content-type': "application/x-www-form-urlencoded"}});
  await reply(datasimi.data.message);
  } catch(e) {
  console.error(e);
  await reply(`Ocorreu um erro`);
  };
  break;
  
  
  //FERRAMENTAS
  case 'encurtalink': case 'tinyurl': try {
  if(!q) return reply(`❌️ *Forma incorreta, use está como exemplo:* ${prefix + command} https://instagram.com/hiudyyy_`);
  anu = await axios.get(`https://tinyurl.com/api-create.php?url=${link}`);
  reply(`${anu.data}`);
  } catch(e) {
  console.error(e);
  await reply(`Ocorreu um erro`);
  };
  break

  case 'nick': case 'gerarnick': {
  if(!q) return reply('Digite o nick após o comando.');
  datzn = await styleText(q);
  await reply(datzn.join('\n'));
  };
  break
  
  case 'printsite': case 'ssweb': try{
  if(!q) return reply(`Cade o link?`)
  await nazu.react('✅');
  await nazu.sendMessage(from, {image: {url: `https://image.thum.io/get/fullpage/${q}`}}, {quoted: info})
  } catch(e) {
  console.error(e);
  await reply(`Ocorreu um erro`);
  };
  break
  
  case 'upload':case 'imgpralink':case 'videopralink':case 'gerarlink': try {
  if(!isQuotedImage && !isQuotedVideo && !isQuotedDocument && !isQuotedAudio) return reply(`Marque um video, uma foto, um audio ou um documento`);
  var foto1 = isQuotedImage ? info.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage : {};
  var video1 = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : {};
  var docc1 = isQuotedDocument ? info.message.extendedTextMessage.contextInfo.quotedMessage.documentMessage: {};
  var audio1 = isQuotedAudio ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : "";
  let media = {};
  if(isQuotedDocument) {
  media = await getFileBuffer(docc1, "document");
  } else if(isQuotedVideo) {
  media = await getFileBuffer(video1, "video");
  } else if(isQuotedImage) {
  media = await getFileBuffer(foto1, "image");
  } else if(isQuotedAudio) {
  media = await getFileBuffer(audio1, "audio");
  };
  let linkz = await upload(media);
  reply(`💞 Link gerado:\n${linkz}`);
  } catch(e) {
  console.error(e);
  await reply(`Ocorreu um erro`);
  }
  break

  
  //DOWNLOADS
  case 'assistir': {
  if(!q) return reply('Cadê o nome do filme ou episódio de série? 🤔');
  await reply('Um momento, estou buscando as informações para você 🕵️‍♂️');
  datyz = await FilmesDL(q);
  if(!datyz || !datyz.url) return reply('Desculpe, não consegui encontrar nada. Tente com outro nome de filme ou série. 😔');
  anu = await axios.get(`https://tinyurl.com/api-create.php?url=${datyz.url}`);
  linkEncurtado = anu.data;
  await nazu.sendMessage(from, {image: { url: datyz.img },caption: `Aqui está o que encontrei! 🎬\n\n*Nome*: ${datyz.name}\n\nSe tudo estiver certo, você pode assistir no link abaixo:\n${linkEncurtado}\n\nFique tranquilo, não é vírus! O link foi encurtado por ser muito longo.\n\n> Você pode apoiar o projeto de outra forma! 💖 Que tal dar uma estrela no repositório do GitHub? Isso ajuda a motivar e melhorar o bot!\n> ⭐ https://github.com/hiudyy/nazuninha-bot 🌟`}, { quoted: info });
  };
  break;
  
  case 'mcplugin':case 'mcplugins': {
  if(!q) return reply('Cadê o nome do plugin para eu pesquisar? 🤔');
  await nazu.react('🔍');
  datz = await mcPlugin(q);
  if(!datz.ok) return reply(datz.msg);
  await nazu.sendMessage(from, {image: {url: datz.image}, caption: `🔍 Encontrei esse plugin aqui:\n\n*Nome*: _${datz.name}_\n*Publicado por*: _${datz.creator}_\n*Descrição*: _${datz.desc}_\n*Link para download*: _${datz.url}_\n\n> 💖 `}, {quoted: info});
  };
  break
  
  case 'play':
  case 'ytmp3':
  try {
    if (!q) return reply(`Digite o nome da música.\n> Ex: ${prefix + command} Back to Black`);
    nazu.react(['💖']);
    datinha = await youtube.search(q);
    if(!datinha.ok) return reply(datinha.msg);
    await nazu.sendMessage(from, { image: { url: datinha.data.thumbnail }, caption: `🎵 *Música Encontrada* 🎵\n\n📌 *Nome:* ${datinha.data.title}\n👤 *Canal:* ${datinha.data.author.name}\n👀 *Visualizações:* ${datinha.data.views}\n🔗 *Link:* ${datinha.data.url}`, footer: `By: ${nomebot}` }, { quoted: info });
    dlRes = await youtube.mp3(datinha.data.url);
    if(!dlRes.ok) return reply(dlRes.msg);
    await nazu.sendMessage(from, {audio: {url: dlRes.url}, fileName: datinha.data.title, mimetype: 'audio/mp4'}, {quoted: info});
  } catch (e) {
    console.error(e);
    reply('Ocorreu um erro durante a requisição.');
  }
  break;
  
  case 'playvid':
  case 'ytmp4':
  try {
    if (!q) return reply(`Digite o nome da música.\n> Ex: ${prefix + command} Back to Black`);
    nazu.react(['💖']);
    datinha = await youtube.search(q);
    if(!datinha.ok) return reply(datinha.msg);
    await nazu.sendMessage(from, { image: { url: datinha.data.thumbnail }, caption: `🎵 *Música Encontrada* 🎵\n\n📌 *Nome:* ${datinha.data.title}\n👤 *Canal:* ${datinha.data.author.name}\n👀 *Visualizações:* ${datinha.data.views}\n🔗 *Link:* ${datinha.data.url}`, footer: `By: ${nomebot}` }, { quoted: info });
    dlRes = await youtube.mp4(datinha.data.url);
    if(!dlRes.ok) return reply(dlRes.msg);
    await nazu.sendMessage(from, {video: {url: dlRes.url}, fileName: datinha.data.title, mimetype: 'video/mp4'}, {quoted: info});
  } catch (e) {
    console.error(e);
    reply('Ocorreu um erro durante a requisição.');
  }
  break;
  
  case 'tiktok': case 'tiktokaudio': case 'tiktokvideo': case 'tiktoks': case 'tiktoksearch': case 'ttk': case 'tkk':
   try {
    if (!q) return reply(`Digite um nome ou o link de um vídeo.\n> Ex: ${prefix}${command} Gato`);
    nazu.react(['💖']);
    let isTikTokUrl = /^https?:\/\/(?:www\.|m\.|vm\.|t\.)?tiktok\.com\//.test(q);
    let datinha = await (isTikTokUrl ? tiktok.dl(q) : tiktok.search(q));
    if (!datinha.ok) return reply(datinha.msg);
    for (const urlz of datinha.urls) {
        await nazu.sendMessage(from, { [datinha.type]: { url: urlz }, mimetype: datinha.mime }, { quoted: info });
    }
    if (datinha.audio) await nazu.sendMessage(from, { audio: { url: datinha.audio }, mimetype: 'audio/mp4' }, { quoted: info });
   } catch (e) {
    console.error(e);
    reply('Ocorreu um erro durante a requisição.');
   }
   break;
   
   case 'instagram': case 'igdl': case 'ig': case 'instavideo':
  try {
    if (!q) return reply(`Digite um link do Instagram.\n> Ex: ${prefix}${command} https://www.instagram.com/reel/DFaq_X7uoiT/?igsh=M3Q3N2ZyMWU1M3Bo`);
    nazu.react(['📌']);
    const datinha = await igdl.dl(q);
    if (!datinha.ok) return reply(datinha.msg);
    await Promise.all(datinha.data.map(urlz => nazu.sendMessage(from, { [urlz.type]: urlz.buff }, { quoted: info })));
  } catch (e) {
    console.error(e);
    reply('Ocorreu um erro na requisição.');
  }
  break;
    
  case 'pinterest': case 'pin': case 'pinterestdl': case 'pinterestsearch':
   try {
    if (!q) return reply(`Digite um nome ou envie um link do Pinterest.\n> Ex: ${prefix}${command} Gatos\n> Ex: ${prefix}${command} https://www.pinterest.com/pin/123456789/`);  
    nazu.react(['📌']); 
    let datinha = await (/^https?:\/\/(?:[a-zA-Z0-9-]+\.)?pinterest\.\w{2,6}(?:\.\w{2})?\/pin\/\d+|https?:\/\/pin\.it\/[a-zA-Z0-9]+/.test(q) ? pinterest.dl(q) : pinterest.search(q));
    if (!datinha.ok) return reply(datinha.msg);
    for (const urlz of datinha.urls) {
        await nazu.sendMessage(from, { [datinha.type]: { url: urlz }, mimetype: datinha.mime }, { quoted: info });
    }
   } catch (e) {
    console.error(e);
    reply('Ocorreu um erro na requisição.');
   }
   break;
   
   
   //MENUS AQUI BB
  case 'menu': case 'help':
  nazu.sendMessage(from, {[fs.existsSync(__dirname + '/../midias/menu.mp4') ? 'video' : 'image']: fs.readFileSync(fs.existsSync(__dirname+'/../midias/menu.mp4')?__dirname+'/../midias/menu.mp4':__dirname+'/../midias/menu.jpg'), caption: await menu(prefix), gifPlayback: fs.existsSync(__dirname+'/../midias/menu.mp4'), mimetype: fs.existsSync(__dirname+'/../midias/menu.mp4')?'video/mp4':'image/jpeg'}, {quoted: info});
  break;
  case 'menuia': case 'aimenu': case 'menuias':
  nazu.sendMessage(from, {[fs.existsSync(__dirname + '/../midias/menu.mp4') ? 'video' : 'image']: fs.readFileSync(fs.existsSync(__dirname+'/../midias/menu.mp4')?__dirname+'/../midias/menu.mp4':__dirname+'/../midias/menu.jpg'), caption: await menuIa(prefix), gifPlayback: fs.existsSync(__dirname+'/../midias/menu.mp4'), mimetype: fs.existsSync(__dirname+'/../midias/menu.mp4')?'video/mp4':'image/jpeg'}, {quoted: info});
  break;
  case 'menubn': case 'menubrincadeira': case 'menubrincadeiras':
  nazu.sendMessage(from, {[fs.existsSync(__dirname + '/../midias/menu.mp4') ? 'video' : 'image']: fs.readFileSync(fs.existsSync(__dirname+'/../midias/menu.mp4')?__dirname+'/../midias/menu.mp4':__dirname+'/../midias/menu.jpg'), caption: await menubn(prefix), gifPlayback: fs.existsSync(__dirname+'/../midias/menu.mp4'), mimetype: fs.existsSync(__dirname+'/../midias/menu.mp4')?'video/mp4':'image/jpeg'}, {quoted: info});
  break;
  case 'menudown': case 'menudownload': case 'menudownloads':
  nazu.sendMessage(from, {[fs.existsSync(__dirname + '/../midias/menu.mp4') ? 'video' : 'image']: fs.readFileSync(fs.existsSync(__dirname+'/../midias/menu.mp4')?__dirname+'/../midias/menu.mp4':__dirname+'/../midias/menu.jpg'), caption: await menudown(prefix), gifPlayback: fs.existsSync(__dirname+'/../midias/menu.mp4'), mimetype: fs.existsSync(__dirname+'/../midias/menu.mp4')?'video/mp4':'image/jpeg'}, {quoted: info});
  break;
  case 'ferramentas': case 'menuferramentas': case 'menuferramenta':
  nazu.sendMessage(from, {[fs.existsSync(__dirname + '/../midias/menu.mp4') ? 'video' : 'image']: fs.readFileSync(fs.existsSync(__dirname+'/../midias/menu.mp4')?__dirname+'/../midias/menu.mp4':__dirname+'/../midias/menu.jpg'), caption: await menuFerramentas(prefix), gifPlayback: fs.existsSync(__dirname+'/../midias/menu.mp4'), mimetype: fs.existsSync(__dirname+'/../midias/menu.mp4')?'video/mp4':'image/jpeg'}, {quoted: info});
  break;
  case 'menuadm': case 'menuadmin': case 'menuadmins':
  nazu.sendMessage(from, {[fs.existsSync(__dirname + '/../midias/menu.mp4') ? 'video' : 'image']: fs.readFileSync(fs.existsSync(__dirname+'/../midias/menu.mp4')?__dirname+'/../midias/menu.mp4':__dirname+'/../midias/menu.jpg'), caption: await menuadm(prefix), gifPlayback: fs.existsSync(__dirname+'/../midias/menu.mp4'), mimetype: fs.existsSync(__dirname+'/../midias/menu.mp4')?'video/mp4':'image/jpeg'}, {quoted: info});
  break;
  case 'menumembros': case 'menumemb': case 'menugeral':
  nazu.sendMessage(from, {[fs.existsSync(__dirname + '/../midias/menu.mp4') ? 'video' : 'image']: fs.readFileSync(fs.existsSync(__dirname+'/../midias/menu.mp4')?__dirname+'/../midias/menu.mp4':__dirname+'/../midias/menu.jpg'), caption: await menuadm(prefix), gifPlayback: fs.existsSync(__dirname+'/../midias/menu.mp4'), mimetype: fs.existsSync(__dirname+'/../midias/menu.mp4')?'video/mp4':'image/jpeg'}, {quoted: info});
  break;
  case 'menudono': case 'ownermenu':
  if(!isOwner) return reply('Apenas meu dono.');
  nazu.sendMessage(from, {[fs.existsSync(__dirname + '/../midias/menu.mp4') ? 'video' : 'image']: fs.readFileSync(fs.existsSync(__dirname+'/../midias/menu.mp4')?__dirname+'/../midias/menu.mp4':__dirname+'/../midias/menu.jpg'), caption: await menuDono(prefix), gifPlayback: fs.existsSync(__dirname+'/../midias/menu.mp4'), mimetype: fs.existsSync(__dirname+'/../midias/menu.mp4')?'video/mp4':'image/jpeg'}, {quoted: info});
  break;
  case 'stickermenu': case 'menusticker':case 'menufig':
  if(!isOwner) return reply('Apenas meu dono.');
  nazu.sendMessage(from, {[fs.existsSync(__dirname + '/../midias/menu.mp4') ? 'video' : 'image']: fs.readFileSync(fs.existsSync(__dirname+'/../midias/menu.mp4')?__dirname+'/../midias/menu.mp4':__dirname+'/../midias/menu.jpg'), caption: await menuSticker(prefix), gifPlayback: fs.existsSync(__dirname+'/../midias/menu.mp4'), mimetype: fs.existsSync(__dirname+'/../midias/menu.mp4')?'video/mp4':'image/jpeg'}, {quoted: info});
  break;
   
   
  //COMANDOS DE DONO BB
  case 'seradm': try {
  if(!isOwner) return reply("Apenas meu dono.")
  await nazu.groupParticipantsUpdate(from, [sender], "promote");
  await nazu.react('✅');
  } catch(e) {
  console.error(e);
  await reply(`Ocorreu um erro`);
  };
  break

  case 'sermembro': try {
  if(!isOwner) return reply("Apenas meu dono.");
  await nazu.groupParticipantsUpdate(from, [sender], "demote");
  await nazu.react('✅');
  } catch(e) {
  console.error(e);
  await reply(`Ocorreu um erro`);
  };
  break

   case 'prefixo':case 'numerodono':case 'nomedono':case 'nomebot': try {
    if(!isOwner) return reply('Apenas meu dono.');
    if (!q) return reply(`Uso correto: ${prefix}${command} <valor>`);
     let config = JSON.parse(fs.readFileSync(__dirname + '/config.json'));
     config[command] = q;
     fs.writeFileSync(__dirname + '/config.json', JSON.stringify(config, null, 2));
     reply(`✅ ${command} atualizado para: *${q}*`);
   } catch (e) {
   console.error(e);
   reply('❌ Ocorreu um erro ao atualizar a configuração.');
   };
  break;
  
  case 'fotomenu':case 'videomenu':case 'mediamenu':case 'midiamenu': try {
   if(!isOwner) return reply('Apenas meu dono.');
   if(fs.existsSync(__dirname+'/../midias/menu.jpg')) fs.unlinkSync(__dirname+'/../midias/menu.jpg');
   if(fs.existsSync(__dirname+'/../midias/menu.mp4')) fs.unlinkSync(__dirname+'/../midias/menu.mp4');
   var RSM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    var boij2 = RSM?.imageMessage || info.message?.imageMessage || RSM?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || RSM?.viewOnceMessage?.message?.imageMessage;
   var boij = RSM?.videoMessage || info.message?.videoMessage || RSM?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage || RSM?.viewOnceMessage?.message?.videoMessage;
    if (!boij && !boij2) return reply(`Marque uma imagem ou um vídeo, com o comando: ${prefix + command} (mencionando a mídia)`);
    var isVideo2 = !!boij;
    var buffer = await getFileBuffer(isVideo2 ? boij : boij2, isVideo2 ? 'video' : 'image');
    fs.writeFileSync(__dirname+'/../midias/menu.' + (isVideo2 ? 'mp4' : 'jpg'), buffer);
    await reply('✅ Mídia do menu atualizada com sucesso.');
  } catch(e) {
   console.error(e);
   reply('❌ Ocorreu um erro ao salvar a mídia');
  }
  break
  
  case 'bangp':case 'unbangp':case 'desbangp': {
  if(!isGroup) return reply('❌ Apenas em grupos.');
  if(!isOwner) return reply('❌ Apenas meu dono.');
  banGpIds[from] = !banGpIds[from];
  if(banGpIds[from]) {
  await reply('🚫 Grupo banido, apenas usuarios premium ou meu dono podem utilizar o bot aqui agora.');
  } else {
  await reply('✅ Grupo desbanido, todos podem utilizar o bot novamente.');
  };
  fs.writeFileSync(__dirname + `/../database/dono/bangp.json`, JSON.stringify(banGpIds));
  };
  break
  
  case 'addpremium':case 'addvip':
  try {
    if (!isOwner) return reply('❌ Apenas meu dono.');
    if (!menc_os2) return reply('❌ Marque o usuário que deseja mutar.');
    if(!!premiumListaZinha[menc_os2]) return reply('O usuário ja esta na lista premium.');
    premiumListaZinha[menc_os2] = true;
    await nazu.sendMessage(from, {text: `✅ @${menc_os2.split('@')[0]} foi adicionado(a) a lista premium.`, mentions: [menc_os2] }, { quoted: info });
    fs.writeFileSync(__dirname + `/../database/dono/premium.json`, JSON.stringify(premiumListaZinha));
  } catch (e) {
    console.error(e);
    reply('❌ Ocorreu um erro.');
  }
  break;
  
  case 'delpremium':case 'delvip':case 'rmpremium':case 'rmvip':
  try {
    if(!isOwner) return reply('❌ Apenas meu dono.');
    if(!menc_os2) return reply('❌ Marque o usuário que deseja mutar.');
    if(!premiumListaZinha[menc_os2]) return reply('O usuário não esta na lista premium.');
    delete premiumListaZinha[menc_os2];
    await nazu.sendMessage(from, {text: `🫡 @${menc_os2.split('@')[0]} foi removido(a) da lista premium.`, mentions: [menc_os2] }, { quoted: info });
    fs.writeFileSync(__dirname + `/../database/dono/premium.json`, JSON.stringify(premiumListaZinha));
  } catch (e) {
    console.error(e);
    reply('❌ Ocorreu um erro.');
  }
  break;
  
  
  //COMANDOS GERAIS
  case 'rvisu':case 'open':case 'revelar': {
  await nazu.react("👀");
  var RSMM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage
  var boij22 = RSMM?.imageMessage || info.message?.imageMessage || RSMM?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || RSMM?.viewOnceMessage?.message?.imageMessage;
  var boijj = RSMM?.videoMessage || info.message?.videoMessage || RSMM?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage || RSMM?.viewOnceMessage?.message?.videoMessage;
  var boij33 = RSMM?.audioMessage || info.message?.audioMessage || RSMM?.viewOnceMessageV2?.message?.audioMessage || info.message?.viewOnceMessageV2?.message?.audioMessage || info.message?.viewOnceMessage?.message?.audioMessage || RSMM?.viewOnceMessage?.message?.audioMessage;
  if(boijj) {
  var px = boijj;
  px.viewOnce = false;
  px.video = {url: px.url};
  await nazu.sendMessage(from,px,{quoted:info});
  } else if(boij22) {
  var px = boij22;
  px.viewOnce = false;
  px.image = {url: px.url};
  await nazu.sendMessage(from,px,{quoted:info});
  } else if(boij33) {
  var px = boij33;
  px.viewOnce = false;
  px.audio = {url: px.url};
  await nazu.sendMessage(from,px,{quoted:info});
  } else {
  return reply('Por favor, *mencione uma imagem, video ou áudio em visualização única* para executar o comando.');
  };
  };
  break
  
  case 'rankativos': 
  case 'rankativo': {
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    blue67 = groupData.contador.sort((a, b) => ((a.figu == undefined ? a.figu = 0 : a.figu + a.msg + a.cmd) < (b.figu == undefined ? b.figu = 0 : b.figu + b.cmd + b.msg)) ? 0 : -1);
    menc = [];
    blad = `*🏆 Rank dos ${blue67.length < 10 ? blue67.length : 10} mais ativos do grupo:*\n`;
    for (i6 = 0; i6 < (blue67.length < 10 ? blue67.length : 10); i6++) {
        if (i6 != null) blad += `\n*🏅 ${i6 + 1}º Lugar:* @${blue67[i6].id.split('@')[0]}\n- mensagens encaminhadas: *${blue67[i6].msg}*\n- comandos executados: *${blue67[i6].cmd}*\n- Figurinhas encaminhadas: *${blue67[i6].figu}*\n`;
        menc.push(blue67[i6].id);
    };
    await nazu.sendMessage(from, {text: blad, mentions: menc}, {quoted: info});
  };
  break;
  
  case 'rankinativos': 
  case 'rankinativo': {
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    blue67 = groupData.contador.sort((a, b) => ((a.msg + a.cmd) < (b.cmd + b.msg)) ? 0 : -1);
    menc = [];
    blad = `*🗑️ Rank dos ${blue67.length < 10 ? blue67.length : 10} mais inativos do grupo:*\n`;
    for (i6 = 0; i6 < (blue67.length < 10 ? blue67.length : 10); i6++) {
        if (i6 != null) blad += `\n*🏅 ${i6 + 1}º Lugar:* @${blue67[i6].id.split('@')[0]}\n- mensagens encaminhadas: *${blue67[i6].msg}*\n- comandos executados: *${blue67[i6].cmd}*\n- Figurinhas encaminhadas: *${blue67[i6].figu}*\n`;
        menc.push(blue67[i6].id);
    };
    await nazu.sendMessage(from, {text: blad, mentions: menc}, {quoted: info});
  };
  break;
  
  case 'totalcmd':
  case 'totalcomando':
    fs.readFile(__dirname + '/index.js', 'utf8', async (err, data) => {
      if (err) throw err;
      const comandos = [...data.matchAll(/case [`'"](\w+)[`'"]/g)].map(m => m[1]);
      const categorias = [{ name: 'Sub Menus', files: ['/menus/menu.js'] },{ name: 'Downloads', files: ['/menus/menudown.js'] },{ name: 'Funções de adm', files: ['/menus/menuadm.js'] },{ name: 'Brincadeiras', files: ['/menus/menubn.js'] },{ name: 'Funções de dono', files: ['/menus/menudono.js'] },{ name: 'Funções Gerais', files: ['/menus/menumemb.js'] },{ name: 'Ferramentas', files: ['/menus/ferramentas.js'] },{ name: 'Figurinhas', files: ['/menus/menufig.js'] },{ name: 'Inteligencia artificial', files: ['/menus/menuia.js'] }];
      let comandosPorCategoria = {};
      let totalComandosCategoria = 0;
      const countComandos = (filePath) => new Promise((resolve, reject) => {
        fs.readFile(__dirname + filePath, 'utf8', (err, data) => {
          if (err) return reject(err);
          const count = (data.match(/{prefix}/g) || []).length;
          resolve(count);
        });
      });
      for (const categoria of categorias) {
        let comandosCategoria = 0;
        for (const file of categoria.files) {
          try {
            comandosCategoria += await countComandos(file);
          } catch (error) {
            console.error(`Erro ao contar comandos em ${file}:`, error);
          }
        }
        comandosPorCategoria[categoria.name] = comandosCategoria;
        totalComandosCategoria += comandosCategoria;
      };
      const comandosSemCategoria = comandos.length - totalComandosCategoria;
      await nazu.sendMessage(from, {image: {url: `https://nazuninha-banner-gen.onrender.com/banner?num=${String(comandos.length)}&theme=miku`}, caption: `╭〔 🤖 *Meus Comandos* 〕╮\n` + `┣ 📌 Total: *${comandos.length}* comandos\n` + `┣ 📌 Comandos por Categoria:\n┣\n` + Object.keys(comandosPorCategoria).map(categoria => `┣ 📌 ${categoria}: *${comandosPorCategoria[categoria]}* comandos`).join('\n') + `\n┣ 📌 Sem categoria: *${comandosSemCategoria}* comandos\n` + `╰━━━━━━━━━━━━━━━╯`}, { quoted: info });
    });
  break;

  case 'ping':
  try {
    const timestamp = Date.now();
    const speedConverted = (Date.now() - (info.messageTimestamp * 1000)) / 1000;
    const config = JSON.parse(fs.readFileSync(__dirname + '/config.json'));
    function formatUptime(seconds) {let d = Math.floor(seconds / (24 * 3600));let h = Math.floor((seconds % (24 * 3600)) / 3600);let m = Math.floor((seconds % 3600) / 60);let s = Math.floor(seconds % 60);let uptimeStr = [];if (d > 0) uptimeStr.push(`${d}d`);if (h > 0) uptimeStr.push(`${h}h`);if (m > 0) uptimeStr.push(`${m}m`);if (s > 0) uptimeStr.push(`${s}s`);return uptimeStr.join(' ');};    
    const uptime = formatUptime(process.uptime());
    await nazu.sendMessage(from, { image: {url: `https://nazuninha-banner-gen.onrender.com/banner?num=${String(speedConverted.toFixed(3)).replaceAll('.', '')}&theme=original`}, caption: `\n📡 *Status do Bot*\n-----------------------------------\n🤖 *Nome:* ${config.nomebot}\n👤 *Dono:* ${config.nomedono}\n\n📌 *Prefixo:* ${config.prefixo}\n🚀 *Latência:* ${speedConverted.toFixed(3)}s\n⏳ *Uptime:* ${uptime}` }, { quoted: info })
  } catch (e) {
    console.error(e);
    reply('❌ Ocorreu um erro ao obter as informações.');
  }
  break;
  
  
  //COMANDOS DE FIGURINHAS
  case 'toimg':
  if(!isQuotedSticker) return reply('Por favor, *mencione um sticker* para executar o comando.');
  try {
  buff = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage, 'sticker');
  await nazu.sendMessage(from, {image: buff}, {quoted: info});
  } catch(error) {
  await reply('Ocorreu um erro.');
  };
  break

  case 'qc': {
  if(!q) return reply('Falta o texto.');
  const json = {"type": "quote","format": "png","backgroundColor": "#FFFFFF","width": 512,"height": 768,"scale": 2,"messages": [{"entities": [],"avatar": true,"from": {"id": 1,"name": pushname,"photo": {"url": ppimg}},"text": q,"replyMessage": {}}]};
  res = await axios.post('https://bot.lyo.su/quote/generate', json, {headers: {'Content-Type': 'application/json'}});
  await sendSticker(nazu, from, { sticker: Buffer.from(res.data.result.image, 'base64'), author: 'Hiudy', packname: 'By:', type: 'image' }, {quoted: info });
  };
  break;
  
  case 'emojimix': {
  emoji1 = q.split(`/`)[0];emoji2 = q.split(`/`)[1];
  if(!q || !emoji1 || !emoji2) return reply(`Formato errado, utilize:\n${prefix}${command} emoji1/emoji2\nEx: ${prefix}${command} 🤓/🙄`);
  datzc = await emojiMix(emoji1, emoji2);
  await sendSticker(nazu, from, { sticker: {url: datzc}, author: 'Hiudy', packname: 'By:', type: 'image'}, { quoted: info });
  };
  break;
  
  case 'ttp': {
  if(!q) return reply('Cadê o texto?');
  cor = ["f702ff","ff0202","00ff2e","efff00","00ecff","3100ff","ffb400","ff00b0","00ff95","efff00"];
  fonte = ["Days%20One","Domine","Exo","Fredoka%20One","Gentium%20Basic","Gloria%20Hallelujah","Great%20Vibes","Orbitron","PT%20Serif","Pacifico"];
  cores = cor[Math.floor(Math.random() * (cor.length))];
  fontes = fonte[Math.floor(Math.random() * (fonte.length))];
  await sendSticker(nazu, from, { sticker: {url: `https://huratera.sirv.com/PicsArt_08-01-10.00.42.png?profile=Example-Text&text.0.text=${q}&text.0.outline.color=000000&text.0.outline.blur=0&text.0.outline.opacity=55&text.0.color=${cores}&text.0.font.family=${fontes}&text.0.background.color=ff0000`}, author: 'Hiudy', packname: 'By:', type: 'image'}, { quoted: info });
  };
  break;
  
  case 'st':case 'stk':case 'sticker':case 's': {
    var RSM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    var boij2 = RSM?.imageMessage || info.message?.imageMessage || RSM?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || RSM?.viewOnceMessage?.message?.imageMessage;
   var boij = RSM?.videoMessage || info.message?.videoMessage || RSM?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage || RSM?.viewOnceMessage?.message?.videoMessage;
    if (!boij && !boij2) return reply(`Marque uma imagem ou um vídeo de até 9.9 segundos para fazer figurinha, com o comando: ${prefix + command} (mencionando a mídia)`);
    var isVideo2 = !!boij;
    if (isVideo2 && boij.seconds > 9.9) return reply(`O vídeo precisa ter no máximo 9.9 segundos para ser convertido em figurinha.`);
    var buffer = await getFileBuffer(isVideo2 ? boij : boij2, isVideo2 ? 'video' : 'image')
    await sendSticker(nazu, from, { sticker: buffer, author: 'Hiudy', packname: 'By:', type: isVideo2 ? 'video' : 'image'}, { quoted: info });
  }
  break
  
  case 'figualeatoria':case 'randomsticker': {
   await nazu.sendMessage(from, { sticker: { url: `https://raw.githubusercontent.com/badDevelopper/Testfigu/main/fig (${Math.floor(Math.random() * 8051)}).webp`}}, {quoted: info});
  };
  break;
  
  case 'rename':case 'roubar': {
   if(!isQuotedSticker) return reply('Você usou de forma errada... Marque uma figurinha.')
   author = q.split(`/`)[0];packname = q.split(`/`)[1];
   if(!q || !author || !packname) return reply(`Formato errado, utilize:\n${prefix}${command} Autor/Pack\nEx: ${prefix}${command} By:/Hiudy`);
   encmediats = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage, 'sticker');
   await sendSticker(nazu, from, { sticker: `data:image/jpeg;base64,${encmediats.toString('base64')}`, author: packname, packname: author, rename: true}, { quoted: info });
  };
  break;
  
  case 'rgtake': {
  const [author, pack] = q.split('/');
  if (!q || !author || !pack) return reply(`Formato errado, utilize:\n${prefix}${command} Autor/Pack\nEx: ${prefix}${command} By:/Hiudy`);
  const filePath = __dirname + '/../database/users/take.json';
  const dataTake = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf-8')) : {};
  dataTake[sender] = { author, pack };
  fs.writeFileSync(filePath, JSON.stringify(dataTake, null, 2), 'utf-8');
  reply(`Autor e pacote salvos com sucesso!\nAutor: ${author}\nPacote: ${pack}`);
  };
  break;
  
  case 'take': {
  if (!isQuotedSticker) return reply('Você usou de forma errada... Marque uma figurinha.');
  const filePath = __dirname + '/../database/users/take.json';
  if (!fs.existsSync(filePath)) return reply('Nenhum autor e pacote salvos. Use o comando *rgtake* primeiro.');
  const dataTake = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  if (!dataTake[sender]) return reply('Você não tem autor e pacote salvos. Use o comando *rgtake* primeiro.');
  const { author, pack } = dataTake[sender];
  const encmediats = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage, 'sticker');
  await sendSticker(nazu, from, { sticker: `data:image/jpeg;base64,${encmediats.toString('base64')}`, author: pack, packname: author, rename: true }, { quoted: info });
  };
  break;
  
  //FIM COMANDOS DE FIGURINHAS
  
  
  case 'mention':
  try {
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    if (!q) return reply(`📢 *Configuração de Marcações*\n\n🔧 Escolha como deseja ser mencionado:\n\n✅ *${prefix}mention all* → Marcado em tudo (marcações e jogos).\n📢 *${prefix}mention marca* → Apenas em marcações de administradores.\n🎮 *${prefix}mention games* → Somente em jogos do bot.\n🚫 *${prefix}mention 0* → Não será mencionado em nenhuma ocasião.`);
    let options = {  all: '✨ Você agora será mencionado em todas as interações do bot, incluindo marcações de administradores e os jogos!', marca: '📢 A partir de agora, você será mencionado apenas quando um administrador marcar.',games: '🎮 Você optou por ser mencionado somente em jogos do bot.', 0: '🔕 Silêncio ativado! Você não será mais mencionado pelo bot, nem em marcações nem em jogos.'};
    if (options[q.toLowerCase()] !== undefined) {
      if(!groupData.mark) groupData.mark = {};
      groupData.mark[sender] = q.toLowerCase();
      fs.writeFileSync(__dirname + `/../database/grupos/${from}.json`, JSON.stringify(groupData, null, 2));
      return reply(`*${options[q.toLowerCase()]}*`);
    }

    reply(`❌ Opção inválida! Use *${prefix}mention* para ver as opções.`);
  } catch (e) {
    console.error(e);
    reply('❌ Erro ao atualizar configuração.');
  }
  break;
  
  //COMANDOS DE ADM
  case 'deletar': case 'delete': case 'del':  case 'd':
  if(!isGroupAdmins && !isPremium) return reply('❌ Apenas admins.');
  if(!menc_prt) return reply("Marque a mensagem do usuário que deseja apagar, do bot ou de alguém...")
  await nazu.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.message.extendedTextMessage.contextInfo.stanzaId, participant: menc_prt}});
  break

  case 'banir':
  case 'ban':
  case 'b':
  case 'kick':
  try {
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    if (!isGroupAdmin) return reply('❌ Apenas administradores podem usar este comando.');
    if (!isBotAdmin) return reply('❌ O bot precisa ser administrador para remover membros.');
    if (!menc_os2) return reply('❌ Marque o usuário que deseja banir.');   
    await nazu.groupParticipantsUpdate(from, [menc_os2], 'remove');
    reply(`✅ Usuário banido com sucesso!`);
  } catch (e) {
    console.error(e);
    reply('❌ Ocorreu um erro ao tentar banir o usuário.');
  }
  break;
  
    case 'linkgp':
    case 'linkgroup':
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    if (!isGroupAdmin) return reply('❌ Apenas administradores podem usar este comando.');
    if (!isBotAdmin) return reply('❌ O bot precisa ser administrador para remover membros.');
    linkgc = await nazu.groupInviteCode(from)
    await reply('https://chat.whatsapp.com/'+linkgc)
    break

  case 'promover':
  try {
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    if (!isGroupAdmin) return reply('❌ Apenas administradores podem usar este comando.');
    if (!isBotAdmin) return reply('❌ O bot precisa ser administrador para promover membros.');
    if (!menc_os2) return reply('❌ Marque o usuário que deseja promover.');
    await nazu.groupParticipantsUpdate(from, [menc_os2], 'promote');
    reply(`✅ Usuário promovido a administrador!`);
  } catch (e) {
    console.error(e);
    reply('❌ Ocorreu um erro ao tentar promover o usuário.');
  }
  break;

  case 'rebaixar':
  try {
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    if (!isGroupAdmin) return reply('❌ Apenas administradores podem usar este comando.');
    if (!isBotAdmin) return reply('❌ O bot precisa ser administrador para rebaixar membros.');
    if (!menc_os2) return reply('❌ Marque o usuário que deseja rebaixar.');
    await nazu.groupParticipantsUpdate(from, [menc_os2], 'demote');
    reply(`✅ Usuário rebaixado com sucesso!`);
  } catch (e) {
    console.error(e);
    reply('❌ Ocorreu um erro ao tentar rebaixar o usuário.');
  }
  break;

  case 'setname':
  try {
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    if (!isGroupAdmin) return reply('❌ Apenas administradores podem usar este comando.');
    if (!isBotAdmin) return reply('❌ O bot precisa ser administrador para mudar o nome do grupo.');
    const newName = q.trim();
    if (!newName) return reply('❌ Digite um novo nome para o grupo.');
    await nazu.groupUpdateSubject(from, newName);
    reply(`✅ Nome do grupo alterado para: *${newName}*`);
  } catch (e) {
    console.error(e);
    reply('❌ Ocorreu um erro ao tentar mudar o nome do grupo.');
  }
  break;

  case 'setdesc':
  try {
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    if (!isGroupAdmin) return reply('❌ Apenas administradores podem usar este comando.');
    if (!isBotAdmin) return reply('❌ O bot precisa ser administrador para mudar a descrição do grupo.');
    const newDesc = q.trim();
    if (!newDesc) return reply('❌ Digite uma nova descrição para o grupo.');
    await nazu.groupUpdateDescription(from, newDesc);
    reply(`✅ Descrição do grupo alterada!`);
  } catch (e) {
    console.error(e);
    reply('❌ Ocorreu um erro ao tentar mudar a descrição do grupo.');
  }
  break;
  
  case 'marcar':
  if (!isGroup) return reply('❌ Apenas para grupos.');
  if (!isGroupAdmin) return reply('🚫 Apenas admins.');
  if (!isBotAdmin) return reply('🤖 O bot precisa ser admin.');
  try {
    let path = __dirname + '/../database/grupos/' + from + '.json';
    let data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : { mark: {} };
    if(!data.mark) data.mark = {};
    let membros = AllgroupMembers.filter(m => !['0', 'games'].includes(data.mark[m]));
    if (!membros.length) return reply('❌ Nenhum membro para mencionar.');
    let msg = `📢 *Membros mencionados:* ${q ? `\n💬 *Mensagem:* ${q}` : ''}\n\n`;
    await nazu.sendMessage(from, {text: msg + membros.map(m => `➤ @${m.split('@')[0]}`).join('\n'), mentions: membros});
  } catch (e) {
    console.error(e);
    reply('⚠️ Erro ao marcar.');
  }
  break;
  
  case 'grupo': {
  if (!isGroup) return reply('❌ Apenas para grupos.');
  if (!isGroupAdmin) return reply('🚫 Apenas admins.');
  if (!isBotAdmin) return reply('🤖 O bot precisa ser admin.');
  if(q.toLowerCase() === 'a' || q.toLowerCase() === 'abrir') {
  await nazu.groupSettingUpdate(from, 'not_announcement');
  await reply('Grupo aberto.');
  } else if(q.toLowerCase() === 'f' || q.toLowerCase() === 'fechar') {
  await nazu.groupSettingUpdate(from, 'announcement');
  await reply('Grupo fechado.');
  }};
  break
  
  case 'totag':
  case 'cita':
  case 'hidetag': {
  if (!isGroup) return reply('❌ Apenas para grupos.');
  if (!isGroupAdmin) return reply('🚫 Apenas admins.');
  if (!isBotAdmin) return reply('🤖 O bot precisa ser admin.');
    
    var DFC4 = "";
    var rsm4 = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    var pink4 = isQuotedImage ? rsm4?.imageMessage : info.message?.imageMessage;
    var blue4 = isQuotedVideo ? rsm4?.videoMessage : info.message?.videoMessage;
    var purple4 = isQuotedDocument ? rsm4?.documentMessage : info.message?.documentMessage;
    var yellow4 = isQuotedDocW ? rsm4?.documentWithCaptionMessage?.message?.documentMessage : info.message?.documentWithCaptionMessage?.message?.documentMessage;
    var aud_d4 = isQuotedAudio ? rsm4.audioMessage : "";
    var figu_d4 = isQuotedSticker ? rsm4.stickerMessage : "";
    var red4 = isQuotedMsg && !aud_d4 && !figu_d4 && !pink4 && !blue4 && !purple4 && !yellow4 ? rsm4.conversation : info.message?.conversation;
    var green4 = rsm4?.extendedTextMessage?.text || info?.message?.extendedTextMessage?.text;
    let path = __dirname + '/../database/grupos/' + from + '.json';
    let data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : { mark: {} };
    if(!data.mark) data.mark = {};
    var MRC_TD4 = AllgroupMembers.filter(m => !['0', 'games'].includes(data.mark[m]));

    if (pink4 && !aud_d4 && !purple4) {
        var DFC4 = pink4;
        pink4.caption = q.length > 1 ? q : pink4.caption.replace(new RegExp(prefix + command, "gi"), ` `);
        pink4.image = { url: pink4.url };
        pink4.mentions = MRC_TD4;
    } else if (blue4 && !aud_d4 && !purple4) {
        var DFC4 = blue4;
        blue4.caption = q.length > 1 ? q.trim() : blue4.caption.replace(new RegExp(prefix + command, "gi"), ` `).trim();
        blue4.video = { url: blue4.url };
        blue4.mentions = MRC_TD4;
    } else if (red4 && !aud_d4 && !purple4) {
        var black4 = {};
        black4.text = red4.replace(new RegExp(prefix + command, "gi"), ` `).trim();
        black4.mentions = MRC_TD4;
        var DFC4 = black4;
    } else if (!aud_d4 && !figu_d4 && green4 && !purple4) {
        var brown4 = {};
        brown4.text = green4.replace(new RegExp(prefix + command, "gi"), ` `).trim();
        brown4.mentions = MRC_TD4;
        var DFC4 = brown4;
    } else if (purple4) {
        var DFC4 = purple4;
        purple4.document = { url: purple4.url };
        purple4.mentions = MRC_TD4;
    } else if (yellow4 && !aud_d4) {
        var DFC4 = yellow4;
        yellow4.caption = q.length > 1 ? q.trim() : yellow4.caption.replace(new RegExp(prefix + command, "gi"), `${pushname}\n\n`).trim();
        yellow4.document = { url: yellow4.url };
        yellow4.mentions = MRC_TD4;
    } else if (figu_d4 && !aud_d4) {
        var DFC4 = figu_d4;
        figu_d4.sticker = { url: figu_d4.url };
        figu_d4.mentions = MRC_TD4;
    } else if (aud_d4) {
        var DFC4 = aud_d4;
        aud_d4.audio = { url: aud_d4.url };
        aud_d4.mentions = MRC_TD4;
        aud_d4.ptt = true;
    };
    await nazu.sendMessage(from, DFC4).catch((error) => {});
    }
    break;
    
    case 'modobrincadeira': case 'modobrincadeiras': case 'modobn': {
    if (!isGroup) return reply('❌ Apenas para grupos.');
    if (!isGroupAdmin) return reply('🚫 Apenas admins.'); 
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;
    if (!groupData.modobrincadeira || groupData.modobrincadeira === undefined) {
        groupData.modobrincadeira = true;
    } else {
        groupData.modobrincadeira = !groupData.modobrincadeira;
    };
    fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
    if (groupData.modobrincadeira) {
        await reply('🎉 *Modo de Brincadeiras ativado!* Agora o grupo está no modo de brincadeiras. Divirta-se!');
    } else {
        await reply('⚠️ *Modo de Brincadeiras desativado!* O grupo não está mais no modo de brincadeiras.');
    }};
    break;
    
    case 'bemvindo': case 'bv': case 'boasvindas': {
    if (!isGroup) return reply('❌ *Este comando só pode ser usado em grupos!*');
    if (!isGroupAdmin) return reply('🚫 *Apenas administradores podem ativar ou desativar as boas-vindas!*');     
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;   
    if (!groupData.bemvindo || groupData.bemvindo === undefined) {
        groupData.bemvindo = true;
    } else {
        groupData.bemvindo = !groupData.bemvindo;
    };
    fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
    if (groupData.bemvindo) {
        await reply(`✅ *Boas-vindas ativadas!* Agora, novos membros serão recebidos com uma mensagem personalizada.\n📝 Para configurar a mensagem, use: *${prefixo}legendabv*`);
    } else {
        await reply('⚠️ *Boas-vindas desativadas!* O grupo não enviará mais mensagens para novos membros.');
    }};
    break;
    
    case 'soadm': case 'onlyadm': case 'soadmin': {
    if (!isGroup) return reply('❌ *Este comando só pode ser usado em grupos!*');
    if (!isGroupAdmin) return reply('🚫 *Apenas administradores podem utilizar este comando!*');     
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;   
    if (!groupData.soadm || groupData.soadm === undefined) {
        groupData.soadm = true;
    } else {
        groupData.soadm = !groupData.soadm;
    };
    fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
    if (groupData.soadm) {
        await reply(`✅ *Modo apenas adm ativado!* Agora apenas administrdores do grupo poderam utilizar o bot*`);
    } else {
        await reply('⚠️ *Modo apenas adm desativado!* Agora todos os membros podem utilizar o bot novamente.');
    }};
    break;
    
    case 'antilinkgp':
    try {
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    if (!isGroupAdmin) return reply('❌ Apenas administradores podem usar este comando.');
    if (!isBotAdmin) return reply('❌ O bot precisa ser administrador para banir membros.');
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;
    let groupData = fs.existsSync(groupFilePath) ? JSON.parse(fs.readFileSync(groupFilePath)) : { antilinkgp: false };
    groupData.antilinkgp = !groupData.antilinkgp;
    fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
    const message = groupData.antilinkgp ? `✅ *Antilinkgp foi ativado com sucesso!*\n\nAgora, se alguém enviar links de outros grupos, será banido automaticamente. Mantenha o grupo seguro! 🛡️` : `✅ *Antilinkgp foi desativado.*\n\nLinks de outros grupos não serão mais bloqueados. Use com cuidado! ⚠️`;
     reply(`${message}`);
    } catch (e) {
     console.error(e);
     reply('❌ Ocorreu um erro ao tentar configurar o antilinkgp.');
    }
    break;
    
    case 'antiporn':
    try {
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    if (!isGroupAdmin) return reply('❌ Apenas administradores podem usar este comando.');
    if (!isBotAdmin) return reply('❌ O bot precisa ser administrador para banir membros.');

    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;
    let groupData = fs.existsSync(groupFilePath) ? JSON.parse(fs.readFileSync(groupFilePath)) : { antiporn: false };
    groupData.antiporn = !groupData.antiporn;
    fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
    const message = groupData.antiporn ? `✅ *Antiporn foi ativado com sucesso!*\n\nAgora, se alguém enviar conteúdo adulto (NSFW), será banido automaticamente. Mantenha o grupo seguro e adequado! 🛡️` : `✅ *Antiporn foi desativado.*\n\nConteúdo adulto não será mais bloqueado. Use com responsabilidade! ⚠️`;

    reply(`${message}`);
    } catch (e) {
     console.error(e);
     reply('❌ Ocorreu um erro ao tentar configurar o antiporn.');
    }
    break;
    
    case 'antigore':
    try {
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    if (!isGroupAdmin) return reply('❌ Apenas administradores podem usar este comando.');
    if (!isBotAdmin) return reply('❌ O bot precisa ser administrador para banir membros.');
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;
    let groupData = fs.existsSync(groupFilePath) ? JSON.parse(fs.readFileSync(groupFilePath)) : { antigore: false };
    groupData.antigore = !groupData.antigore;
    fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
    const message = groupData.antigore ? `✅ *Antigore foi ativado com sucesso!*\n\nAgora, se alguém enviar conteúdo gore, será banido automaticamente. Mantenha o grupo seguro e saudável! 🛡️` : `✅ *Antigore foi desativado.*\n\nConteúdo gore não será mais bloqueado. Use com cuidado! ⚠️`;
    reply(`${message}`);
  } catch (e) {
    console.error(e);
    reply('❌ Ocorreu um erro ao tentar configurar o antigore.');
  }
  break;
    
    case 'modonsfw':
    case 'modo+18':
    try {
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    if (!isGroupAdmin) return reply('❌ Apenas administradores podem ativar o modo +18.');
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;
    let groupData = fs.existsSync(groupFilePath) ? JSON.parse(fs.readFileSync(groupFilePath)) : { nsfwMode: false };
    groupData.nsfwMode = !groupData.nsfwMode;
    fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
    if (groupData.nsfwMode) {
      await nazu.sendMessage(from, {text: `🔞 *Modo +18 ativado!*`,}, { quoted: info });
    } else {
      await nazu.sendMessage(from, {text: `✅ *Modo +18 desativado!.*`,}, { quoted: info });
    }
    } catch (e) {
     console.error(e);
     reply('❌ Ocorreu um erro ao tentar alterar o modo +18.');
    }
    break;
    
    case 'legendabv': case 'textbv': {
    if (!isGroup) return reply('❌ *Este comando só pode ser usado em grupos!*');
    if (!isGroupAdmin) return reply('🚫 *Apenas administradores podem configurar a mensagem de boas-vindas!*');
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;
    if (!q) return reply(`📝 *Configuração da Mensagem de Boas-Vindas*\n\nPara definir uma mensagem personalizada, digite o comando seguido do texto desejado. Você pode usar as seguintes variáveis:\n\n- *#numerodele#* → Marca o novo membro.\n- *#nomedogp#* → Nome do grupo.\n- *#desc#* → Descrição do grupo.\n- *#membros#* → Número total de membros no grupo.\n\n📌 *Exemplo:*\n${prefixo}legendabv Bem-vindo(a) #numerodele# ao grupo *#nomedogp#*! Agora somos #membros# membros. Leia a descrição: #desc#`);
    groupData.textbv = q;
    fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
    reply(`✅ *Mensagem de boas-vindas configurada com sucesso!*\n\n📌 Nova mensagem:\n"${groupData.textbv}"`);};
  break;
  
  case 'mute':
  case 'mutar':
  try {
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    if (!isGroupAdmin) return reply('❌ Apenas administradores podem usar este comando.');
    if (!isBotAdmin) return reply('❌ O bot precisa ser administrador para mutar membros.');
    if (!menc_os2) return reply('❌ Marque o usuário que deseja mutar.');
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;
    let groupData = fs.existsSync(groupFilePath) ? JSON.parse(fs.readFileSync(groupFilePath)) : { mutedUsers: {} };
    groupData.mutedUsers = groupData.mutedUsers || {};
    groupData.mutedUsers[menc_os2] = true;
    fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
    await nazu.sendMessage(from, {text: `✅ @${menc_os2.split('@')[0]} foi mutado. Se enviar mensagens, será banido.`, mentions: [menc_os2] }, { quoted: info });
  } catch (e) {
    console.error(e);
    reply('❌ Ocorreu um erro ao tentar mutar o usuário.');
  }
  break;
  
  case 'desmute':
  case 'desmutar':
  try {
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    if (!isGroupAdmin) return reply('❌ Apenas administradores podem usar este comando.');
    if (!menc_os2) return reply('❌ Marque o usuário que deseja desmutar.');
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;
    let groupData = fs.existsSync(groupFilePath) ? JSON.parse(fs.readFileSync(groupFilePath)) : { mutedUsers: {} };
    groupData.mutedUsers = groupData.mutedUsers || {};
    if (groupData.mutedUsers[menc_os2]) {
      delete groupData.mutedUsers[menc_os2];
      fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
      await nazu.sendMessage(from, {text: `✅ @${menc_os2.split('@')[0]} foi desmutado e pode enviar mensagens novamente.`, mentions: [menc_os2]}, { quoted: info });
    } else {
      reply('❌ Este usuário não está mutado.');
    }
  } catch (e) {
    console.error(e);
    reply('❌ Ocorreu um erro ao tentar desmutar o usuário.');
  }
  break;
  
  case 'blockcmd':
  try {
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    if (!isGroupAdmin) return reply('❌ Apenas administradores podem usar este comando.');
    if (!q) return reply('❌ Digite o comando que deseja bloquear. Exemplo: /blockcmd sticker');
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;
    let groupData = fs.existsSync(groupFilePath) ? JSON.parse(fs.readFileSync(groupFilePath)) : { blockedCommands: {} };
    groupData.blockedCommands = groupData.blockedCommands || {};
    groupData.blockedCommands[q.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll(prefix, '')] = true;
    fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
    reply(`✅ O comando *${q.trim()}* foi bloqueado e só pode ser usado por administradores.`);
  } catch (e) {
    console.error(e);
    reply('❌ Ocorreu um erro ao tentar bloquear o comando.');
  }
  break;
    
  case 'unblockcmd':
  try {
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    if (!isGroupAdmin) return reply('❌ Apenas administradores podem usar este comando.');
    if (!q) return reply('❌ Digite o comando que deseja desbloquear. Exemplo: /unblockcmd sticker');
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;
    let groupData = fs.existsSync(groupFilePath) ? JSON.parse(fs.readFileSync(groupFilePath)) : { blockedCommands: {} };
    groupData.blockedCommands = groupData.blockedCommands || {};
    if (groupData.blockedCommands[q.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll(prefix, '')]) {
      delete groupData.blockedCommands[q.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll(prefix, '')];
      fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
      reply(`✅ O comando *${q.trim()}* foi desbloqueado e pode ser usado por todos.`);
    } else {
      reply('❌ Este comando não está bloqueado.');
    }
  } catch (e) {
    console.error(e);
    reply('❌ Ocorreu um erro ao tentar desbloquear o comando.');
  }
  break;
    
    //COMANDOS DE BRINCADEIRAS

   case 'gay': case 'burro': case 'inteligente': case 'otaku': case 'fiel': case 'infiel': case 'corno':  case 'gado': case 'gostoso': case 'feio': case 'rico': case 'pobre': case 'pirocudo': case 'pirokudo': case 'nazista': case 'ladrao': case 'safado': case 'vesgo': case 'bebado': case 'machista': case 'homofobico': case 'racista': case 'chato': case 'sortudo': case 'azarado': case 'forte': case 'fraco': case 'pegador': case 'otario': case 'macho': case 'bobo': case 'nerd': case 'preguicoso': case 'trabalhador': case 'brabo': case 'lindo': case 'malandro': case 'simpatico': case 'engracado': case 'charmoso': case 'misterioso': case 'carinhoso': case 'desumilde': case 'humilde': case 'ciumento': case 'corajoso': case 'covarde': case 'esperto': case 'talarico': case 'chorao': case 'brincalhao': case 'bolsonarista': case 'petista': case 'comunista': case 'lulista': case 'traidor': case 'bandido': case 'cachorro': case 'vagabundo': case 'pilantra': case 'mito': case 'padrao': case 'comedia': case 'psicopata': case 'fortao': case 'magrelo': case 'bombado': case 'chefe': case 'presidente': case 'rei': case 'patrao': case 'playboy': case 'zueiro': case 'gamer': case 'programador': case 'visionario': case 'billionario': case 'poderoso': case 'vencedor': case 'senhor': {
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    if (!isModoBn) return reply('❌ O modo brincadeira não esta ativo nesse grupo');
    let gamesData = fs.existsSync(__dirname + '/.funcs/.json/.games.json') ? JSON.parse(fs.readFileSync(__dirname + '/.funcs/.json/.games.json')) : { games: {} };
    const target = menc_os2 ? menc_os2 : sender;
    const targetName = `@${target.split('@')[0]}`;
    const level = Math.floor(Math.random() * 101);
    let responses = fs.existsSync(__dirname + '/.funcs/.json/.gamestext.json') ? JSON.parse(fs.readFileSync(__dirname + '/.funcs/.json/.gamestext.json')) : {};
    const responseText = responses[command].replaceAll('#nome#', targetName).replaceAll('#level#', level) || `📊 ${targetName} tem *${level}%* de ${command}! 🔥`;
    const media = gamesData.games[command]
    if (media?.image) {
        await nazu.sendMessage(from, { image: media.image, caption: responseText, mentions: [target] });
    } else if (media?.video) {
        await nazu.sendMessage(from, { video: media.video, caption: responseText, mentions: [target], gifPlayback: true});
    } else {
        await nazu.sendMessage(from, {text: responseText, mentions: [target]});
    };
};
break;

   case 'lesbica': case 'burra': case 'inteligente': case 'otaku': case 'fiel': case 'infiel': case 'corna': case 'gado': case 'gostosa': case 'feia': case 'rica': case 'pobre': case 'bucetuda': case 'nazista': case 'ladra': case 'safada': case 'vesga': case 'bebada': case 'machista': case 'homofobica': case 'racista': case 'chata': case 'sortuda': case 'azarada': case 'forte': case 'fraca': case 'pegadora': case 'otaria': case 'boba': case 'nerd': case 'preguicosa': case 'trabalhadora': case 'braba': case 'linda': case 'malandra': case 'simpatica': case 'engracada': case 'charmosa': case 'misteriosa': case 'carinhosa': case 'desumilde': case 'humilde': case 'ciumenta': case 'corajosa': case 'covarde': case 'esperta': case 'talarica': case 'chorona': case 'brincalhona': case 'bolsonarista': case 'petista': case 'comunista': case 'lulista': case 'traidora': case 'bandida': case 'cachorra': case 'vagabunda': case 'pilantra': case 'mito': case 'padrao': case 'comedia': case 'psicopata': case 'fortona': case 'magrela': case 'bombada': case 'chefe': case 'presidenta': case 'rainha': case 'patroa': case 'playboy': case 'zueira': case 'gamer': case 'programadora': case 'visionaria': case 'bilionaria': case 'poderosa': case 'vencedora': case 'senhora': {
    if (!isGroup) return reply('❌ Este comando so pode ser usado em grupos.');
    if (!isModoBn) return reply('❌ O modo brincadeira não esta ativo nesse grupo');
    let gamesData = fs.existsSync(__dirname + '/.funcs/.json/.games.json') ? JSON.parse(fs.readFileSync(__dirname + '/.funcs/.json/.games.json')) : { games: {} };
    const target = menc_os2 ? menc_os2 : sender;
    const targetName = `@${target.split('@')[0]}`;
    const level = Math.floor(Math.random() * 101);
    let responses = fs.existsSync(__dirname + '/.funcs/.json/.gamestext2.json') ? JSON.parse(fs.readFileSync(__dirname + '/.funcs/.json/.gamestext2.json')) : {};
    const responseText = responses[command].replaceAll('#nome#', targetName).replaceAll('#level#', level) || `📊 ${targetName} tem *${level}%* de ${command}! 🔥`;
    const media = gamesData.games[command]
    if (media?.image) {
        await nazu.sendMessage(from, { image: media.image, caption: responseText, mentions: [target] });
    } else if (media?.video) {
        await nazu.sendMessage(from, { video: media.video, caption: responseText, mentions: [target], gifPlayback: true});
    } else {
        await nazu.sendMessage(from, {text: responseText, mentions: [target]});
    };
};
break;

case 'rankgay': case 'rankburro': case 'rankinteligente': case 'rankotaku': case 'rankfiel': case 'rankinfiel': case 'rankcorno': case 'rankgado': case 'rankgostoso': case 'rankrico': case 'rankpobre': case 'rankforte': case 'rankpegador': case 'rankmacho': case 'ranknerd': case 'ranktrabalhador': case 'rankbrabo': case 'ranklindo': case 'rankmalandro': case 'rankengracado': case 'rankcharmoso': case 'rankvisionario': case 'rankpoderoso': case 'rankvencedor':case 'rankgays': case 'rankburros': case 'rankinteligentes': case 'rankotakus': case 'rankfiels': case 'rankinfieis': case 'rankcornos': case 'rankgados': case 'rankgostosos': case 'rankricos': case 'rankpobres': case 'rankfortes': case 'rankpegadores': case 'rankmachos': case 'ranknerds': case 'ranktrabalhadores': case 'rankbrabos': case 'ranklindos': case 'rankmalandros': case 'rankengracados': case 'rankcharmosos': case 'rankvisionarios': case 'rankpoderosos': case 'rankvencedores': {
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    if (!isModoBn) return reply('❌ O modo brincadeira não está ativo nesse grupo.');
    let path = __dirname + '/../database/grupos/' + from + '.json';
    let gamesData = fs.existsSync(__dirname + '/.funcs/.json/.games.json') ? JSON.parse(fs.readFileSync(__dirname + '/.funcs/.json/.games.json')) : { ranks: {} };
    let data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : { mark: {} };
    let membros = AllgroupMembers.filter(m => !['0', 'marca'].includes(data.mark[m]));
    if (membros.length < 5) return reply('❌ Membros insuficientes para formar um ranking.');
    let top5 = membros.sort(() => Math.random() - 0.5).slice(0, 5);
    let cleanedCommand = command.endsWith('s') ? command.slice(0, -1) : command;
    let ranksData = fs.existsSync(__dirname + '/.funcs/.json/.ranks.json') ? JSON.parse(fs.readFileSync(__dirname + '/.funcs/.json/.ranks.json')) : { ranks: {} };
    let responseText = ranksData[cleanedCommand] || `📊 *Ranking de ${cleanedCommand.replace('rank', '')}*:\n\n`;
    top5.forEach((m, i) => {
        responseText += `🏅 *#${i + 1}* - @${m.split('@')[0]}\n`;
    });
    let media = gamesData.ranks[cleanedCommand];
    if (media?.image) {
        await nazu.sendMessage(from, { image: media.image, caption: responseText, mentions: top5 });
    } else if (media?.video) {
        await nazu.sendMessage(from, { video: media.video, caption: responseText, mentions: top5, gifPlayback: true });
    } else {
        await nazu.sendMessage(from, { text: responseText, mentions: top5 });
    }
};
break;

case 'ranklesbica': case 'rankburra': case 'rankinteligente': case 'rankotaku': case 'rankfiel': case 'rankinfiel': case 'rankcorna': case 'rankgada': case 'rankgostosa': case 'rankrica': case 'rankpobre': case 'rankforte': case 'rankpegadora': case 'ranknerd': case 'ranktrabalhadora': case 'rankbraba': case 'ranklinda': case 'rankmalandra': case 'rankengracada': case 'rankcharmosa': case 'rankvisionaria': case 'rankpoderosa': case 'rankvencedora':case 'ranklesbicas': case 'rankburras': case 'rankinteligentes': case 'rankotakus': case 'rankfiels': case 'rankinfieis': case 'rankcornas': case 'rankgads': case 'rankgostosas': case 'rankricas': case 'rankpobres': case 'rankfortes': case 'rankpegadoras': case 'ranknerds': case 'ranktrabalhadoras': case 'rankbrabas': case 'ranklindas': case 'rankmalandras': case 'rankengracadas': case 'rankcharmosas': case 'rankvisionarias': case 'rankpoderosas': case 'rankvencedoras': {
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    if (!isModoBn) return reply('❌ O modo brincadeira não está ativo nesse grupo.');
    let path = __dirname + '/../database/grupos/' + from + '.json';
    let gamesData = fs.existsSync(__dirname + '/.funcs/.json/.games.json') ? JSON.parse(fs.readFileSync(__dirname + '/.funcs/.json/.games.json')) : { ranks: {} };
    let data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : { mark: {} };
    let membros = AllgroupMembers.filter(m => !['0', 'marca'].includes(data.mark[m]));
    if (membros.length < 5) return reply('❌ Membros insuficientes para formar um ranking.');
    let top5 = membros.sort(() => Math.random() - 0.5).slice(0, 5);
    let cleanedCommand = command.endsWith('s') ? command.slice(0, -1) : command;
    let ranksData = fs.existsSync(__dirname + '/.funcs/.json/.ranks.json') ? JSON.parse(fs.readFileSync(__dirname + '/.funcs/.json/.ranks.json')) : { ranks: {} };
    let responseText = ranksData[cleanedCommand]+'\n\n' || `📊 *Ranking de ${cleanedCommand.replace('rank', '')}*:\n\n`;
    top5.forEach((m, i) => {
        responseText += `🏅 *#${i + 1}* - @${m.split('@')[0]}\n`;
    });
    let media = gamesData.ranks[cleanedCommand];
    if (media?.image) {
        await nazu.sendMessage(from, { image: media.image, caption: responseText, mentions: top5 });
    } else if (media?.video) {
        await nazu.sendMessage(from, { video: media.video, caption: responseText, mentions: top5, gifPlayback: true });
    } else {
        await nazu.sendMessage(from, { text: responseText, mentions: top5 });
    }
};
break;

   case 'chute': case 'chutar': case 'tapa': case 'soco': case 'socar': case 'beijo': case 'beijar': case 'beijob': case 'beijarb': case 'abraco': case 'abracar': case 'mata': case 'matar': case 'tapar': case 'goza': case 'gozar': case 'mamar': case 'mamada': case 'cafune': case 'morder': case 'mordida': case 'lamber': case 'lambida': case 'explodir':
    if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');
    if (!isModoBn) return reply('❌ O modo brincadeira não está ativo nesse grupo.');
    if(!menc_os2) return reply('Marque um usuário.');
    let gamesData = fs.existsSync(__dirname + '/.funcs/.json/.games.json') ? JSON.parse(fs.readFileSync(__dirname + '/.funcs/.json/.games.json')) : { games2: {} };
    let GamezinData = fs.existsSync(__dirname + '/.funcs/.json/.markgame.json') ? JSON.parse(fs.readFileSync(__dirname + '/.funcs/.json/.markgame.json')) : { ranks: {} };
    let responseText = GamezinData[command].replaceAll('#nome#', `@${menc_os2.split('@')[0]}`) || `Voce acabou de dar um(a) ${command} no(a) @${menc_os2.split('@')[0]}`;
    let media = gamesData.games2[command];
    if (media?.image) {
        await nazu.sendMessage(from, { image: media.image, caption: responseText, mentions: [menc_os2] });
    } else if (media?.video) {
        await nazu.sendMessage(from, { video: media.video, caption: responseText, mentions: [menc_os2], gifPlayback: true });
    } else {
        await nazu.sendMessage(from, { text: responseText, mentions: [menc_os2] });
    }
   break;
   
 default:
 if(isCmd) await nazu.react('❌');
 };
 
 
} catch(e) {
console.error(e);
var {version} = JSON.parse(fs.readFileSync(__dirname+'/../../package.json'));
if (debug) reportError(e, version);
};
};

module.exports = NazuninhaBotExec;