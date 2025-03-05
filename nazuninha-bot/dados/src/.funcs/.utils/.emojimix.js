const axios = require('axios');

async function emojiMix(emoji1, emoji2) {
let datazzc = await axios.get(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`);let jadi = datazzc.data.results[Math.floor(Math.random() * datazzc.data.results.length)];
return jadi.url;};

module.exports = emojiMix;