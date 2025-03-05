// Created By Hiudy (não remova nem edite essa linha)

const { Boom } = require('@hapi/boom');
const panel = require('./.funcs/.panel/.server');
const { makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, DisconnectReason, proto, makeInMemoryStore } = require('baileys');

const readline = require('readline');
const { execSync } = require('child_process');
const pino = require('pino');
const fs = require('fs');
const NodeCache = require("node-cache");

const logger = pino({ level: 'silent' });
const AUTH_DIR = 'dados/database/qr-code';
const msgRetryCounterCache = new NodeCache();

const { prefixo, nomebot, nomedono, numerodono, aviso, enablePanel } = require('./config.json');

const ask = (question) => {
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
return new Promise(resolve => rl.question(question, (answer) => { rl.close(); resolve(answer.trim());}));
};

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' })});

async function startNazu() {
 const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
 const { version } = await fetchLatestBaileysVersion();
 
 async function getMessage(key) {
  if (!store) return proto.Message.fromObject({});
  const msg = await store.loadMessage(key.remoteJid, key.id);
  return msg ? msg.message : undefined;
 };
 
 let nazu = makeWASocket({
    version,
    auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    printQRInTerminal: !process.argv.includes('--code'),
    syncFullHistory: true,
    markOnlineOnConnect: false,
    fireInitQueriesEarly: true,
    msgRetryCounterCache,
    connectTimeoutMs: 180000,
    defaultQueryTimeoutMs: 0,
    keepAliveIntervalMs: 60000,
    retryRequestDelayMs: 10000,
    generateHighQualityLinkPreview: true,
    logger,
    patchMessageBeforeSending: (message) => {
        const requiresPatch = !!(message?.interactiveMessage);
        if (requiresPatch) {
            message = {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadataVersion: 2,
                            deviceListMetadata: {},
                        },
                        ...message,
                    },
                },
            };
        }
        return message;
    },
    getMessage,
    shouldSyncHistoryMessage: () => true,
    browser: ['Ubuntu', 'Edge', '110.0.1587.56']
});
 
 if (process.argv.includes('--code') && !nazu.authState.creds.registered) {
  try {
    let phoneNumber = await ask('📞 Digite seu número (com DDD e DDI): ');
    phoneNumber = phoneNumber.replace(/\D/g, '');
    if (!/^\d{10,15}$/.test(phoneNumber)) return console.log('❌ Número inválido! Tente novamente.');
    const code = await nazu.requestPairingCode(phoneNumber);
    console.log(`🔢 Seu código de pareamento: ${code}`);
    console.log('📲 No WhatsApp, vá em "Aparelhos Conectados" -> "Conectar com Número de Telefone" e insira o código.');
  } catch (err) {
    console.error('❌ Erro ao solicitar código:', err.message || err);
    console.error('📌 Resposta completa do erro:', err);
  };
 };
 
 store.bind(nazu.ev);
 
 nazu.ev.on('creds.update', saveCreds);

 nazu.ev.on('group-participants.update', async (inf) => {
   const from = inf.id;
   if(inf.participants[0].startsWith(nazu.user.id.split(':')[0])) return;
   if(!fs.existsSync(__dirname + `/../database`)) return;
   if(!fs.existsSync(__dirname + `/../database/grupos`)) return;
   if(!fs.existsSync(__dirname + `/../database/grupos/${from}.json`)) return;
   var jsonGp = JSON.parse(fs.readFileSync(__dirname + `/../database/grupos/${from}.json`));
   try { var GroupMetadata = await nazu.groupMetadata(from) } catch (e) { return };
   if(inf.action === 'add') {
   if(!jsonGp.bemvindo) return;
   const sender = inf.participants[0];
   if(jsonGp.imgbv) {
   
   } else {
    const textBv = jsonGp.textbv && jsonGp.textbv.length > 1 ? jsonGp.textbv : 'Seja bem vindo(a) #numerodele# ao #nomedogp#!\nVocê é nosso membro número: *#membros#*!';
    await nazu.sendMessage(from, {text: textBv.replaceAll('#numerodele#', `@${sender.split('@')[0]}`).replaceAll('#nomedogp#', GroupMetadata.subject).replaceAll('#desc#', await GroupMetadata.desc).replaceAll('#membros#', GroupMetadata.participants.length), mentions: [sender]});
   };
   };
 });
 
 nazu.ev.on('messages.upsert', async (m) => {
  try {
    if (!m.messages || !Array.isArray(m.messages)) return;
    for (const info of m.messages) {
    if(!info.message) return;
    if(m.type == "append") return;  
    const indexModulePath = __dirname + '/index.js';
    delete require.cache[require.resolve(indexModulePath)];
    const indexModule = require(indexModulePath);
    if (typeof indexModule === 'function') {
        indexModule(nazu, info);
    } else {
        console.error('O módulo index.js não exporta uma função.');
      }
    }
  } catch (err) {
    console.error('Erro ao processar mensagens:', err);
  }
 });
 
 nazu.ev.on('connection.update', async (update) => {
   const { connection, lastDisconnect, qr } = update;
   if (connection === 'open') {
     console.log(`============================================\nBot: ${nomebot}\nPrefix: ${prefixo}\nDono: ${nomedono}\nCriador: Hiudy\n============================================\n    ✅ BOT INICIADO COM SUCESSO\n============================================`);
     if(aviso) await nazu.sendMessage(numerodono+'@s.whatsapp.net', {text: 'Bot conectado ✅'});
     
     // Initialize panel when bot connects
     if (enablePanel) {
       // Create panel database directory if it doesn't exist
       const dbPath = __dirname + '/../database/panel';
       if (!fs.existsSync(dbPath)) {
         fs.mkdirSync(dbPath, { recursive: true });
       }

       // Initialize stats file if it doesn't exist
       const statsPath = dbPath + '/stats.json';
       if (!fs.existsSync(statsPath)) {
         const initialStats = {
           groups: 0,
           commandsExecuted: 0,
           messagesReceived: 0,
           messagesSent: 0
         };
         fs.writeFileSync(statsPath, JSON.stringify(initialStats));
       }

       // Update group information
       const groups = await nazu.groupFetchAllParticipating();
       const stats = JSON.parse(fs.readFileSync(statsPath));
       stats.groups = Object.keys(groups).length;

       // Save group details
       for (const [id, group] of Object.entries(groups)) {
         if(!group.isCommunity) {
         const groupPath = __dirname + '/../database/grupos/' + id + '.json';
         let groupData = {};
         
         if (fs.existsSync(groupPath)) {
           groupData = JSON.parse(fs.readFileSync(groupPath));
         }

         groupData.name = group.subject;
         groupData.members = group.participants.length;

         // Try to get group profile picture
         try {
           const ppUrl = await nazu.profilePictureUrl(id, 'image');
           groupData.image = ppUrl;
         } catch (err) {
           groupData.image = '/img/default-group.png';
         }

         fs.writeFileSync(groupPath, JSON.stringify(groupData));
       }};

       // Save updated stats
       fs.writeFileSync(statsPath, JSON.stringify(stats));

       // Start the panel server
       panel.startServer();
     }
   };
   if (connection === 'close') {
     const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
     console.log(`⚠️ Conexão fechada, motivo: ${reason}`);
     if (reason === DisconnectReason.loggedOut || reason === 401) {
       console.log('🗑️ Sessão inválida, excluindo autenticação...');
       execSync(`rm -rf ${AUTH_DIR}`);
      } else if(reason == 408) {
       console.log('A sessão sofreu um timeout, recarregando...');
      } else if(reason == 411) {
       console.log('O arquivo de sessão parece incorreto, estou tentando recarregar...');
      } else if(reason == 428) {
       console.log('Não foi possível manter a conexão com o WhatsApp, tentando de novo...');
      } else if(reason == 440) {
       console.log('Existem muitas sessões do WhatsApp conectadas no meu número, feche-as...');
      } else if(reason == 500) {
       console.log('A sessão parece mal configurada, estarei tentando reconectar...');
      } else if(reason == 503) {
       console.log('Erro desconhecido...');
      } else if(reason == 515) {
       console.log('Meu código será reinicializado para estabilizar a conexão...');
      };
      await nazu.end();
      console.log(`🔄 Tentando reconectar...`);
      startNazu();
     };
   if(connection == 'connecting') {
     console.log('Atualizando a sessão para garantir o funcionamento correto do sistema.');
   };
 });
};

// Inicia o bot
startNazu().catch(async(e) => console.error(e));
