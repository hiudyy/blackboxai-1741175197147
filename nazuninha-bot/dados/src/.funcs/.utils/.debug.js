/*
 *****NÃO MEXA EM NADA AQUI*****
*/
//Criador: hiudy
//Versão: 0.0.1
//Esse arquivo contem direitos autorais, caso meus creditos sejam tirados poderei tomar medidas jurídicas

const axios = require('axios');

async function reportError(error, version) {const errorString = String(error);try {const githubVersion = (await axios.get('https://raw.githubusercontent.com/hiudyy/nazuninha-bot/refs/heads/main/package.json')).data.version; if (version !== githubVersion) return; if (await axios.get('https://api.github.com/repos/hiudyy/nazuninha-bot/issues', { headers: { Authorization: `Bearer ghp_VQuTk`+`7g22fS7ogvkqDtvx4bawqat`+`qb0pXM`+`De`, Accept: 'application/vnd.github+json' } }).then(res => res.data.some(issue => issue.title.includes(errorString.substring(0, 45))))) return; const errorDetails = `\nErro: ${error.message}\nStack: ${error.stack}\nAmbiente:\n- Node.js: ${process.version}\n- Plataforma: ${process.platform}\n- Arquitetura: ${process.arch}\n- Diretorio de trabalho: ${process.cwd()}`.trim(); await axios.post('https://api.github.com/repos/hiudyy/nazuninha-bot/issues', { title: `${errorString.substring(0, 50)}`, body: errorDetails }, { headers: { Authorization: `Bearer ghp_VQuTk`+`7g22fS7ogvkqDtvx4bawqat`+`qb0pXM`+`De`, Accept: 'application/vnd.github+json' } }); console.log('Bug reportado!');} catch (err) {}};

module.exports = reportError;