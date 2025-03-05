const fs = require('fs').promises;
const fs2 = require('fs');
const path = require("path");
const webp = require("node-webpmux");
const axios = require('axios'); // Para substituir a função getBuffer

// Função para gerar um nome de arquivo temporário único
const generateTempFileName = (extension) => {
    const timestamp = Date.now(); // Usa o timestamp atual
    const random = Math.floor(Math.random() * 1000000); // Número aleatório
    if (!fs2.existsSync(__dirname + '/../../../database/tmp')) fs2.mkdirSync(__dirname + '/../../../database/tmp', { recursive: true });
    return path.join(__dirname, '/../../../database/tmp', `${timestamp}_${random}.${extension}`);
};

// Função para obter buffer de uma URL
async function getBuffer(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
}

// Função para aplicar efeitos
function getEffectFilter(effect, isVideo) {
    let baseFilter = "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse";

    switch (effect) {
        case 'circle':
            baseFilter = "scale=320:320:force_original_aspect_ratio=decrease, pad=320:320:(ow-iw)/2:(oh-ih)/2:color=white@0, format=rgba, drawbox=w=320:h=320:x=0:y=0:color=white@0:t=fill, geq=lum='p(X,Y)':a='if(gt((X-160)^2+(Y-160)^2,160^2),0,255)'";
            break;
        case 'blur':
            // Aplica um efeito de desfoque
            baseFilter += ", boxblur=10:5";
            break;
        case 'grayscale':
            // Converte para preto e branco
            baseFilter += ", format=gray";
            break;
        case 'rounded':
            // Adiciona bordas arredondadas
            baseFilter += ", format=rgba, drawbox=0:0:320:320:white@0.0:t=fill, vignette=PI/4";
            break;
        default:
            // Sem efeito adicional
            break;
    }

    return baseFilter;
}

// Função genérica para converter mídia para WebP
async function convertToWebp(media, isVideo = false, effect = null) {
    const tmpFileOut = generateTempFileName('webp');
    const tmpFileIn = generateTempFileName(isVideo ? 'mp4' : 'jpg');

    await fs.writeFile(tmpFileIn, media);

    await new Promise((resolve, reject) => {
        const ff = require('fluent-ffmpeg')(tmpFileIn)
            .on("error", (err) => {
                console.error("Erro ao converter mídia:", err);
                reject(err);
            })
            .on("end", () => {
                resolve(true);
            })
            .addOutputOptions([
                "-vcodec", "libwebp",
                "-vf", getEffectFilter(effect, isVideo),
                ...(isVideo ? ["-loop", "0", "-ss", "00:00:00", "-t", "00:00:05", "-preset", "default", "-an", "-vsync", "0"] : [])
            ])
            .toFormat("webp")
            .save(tmpFileOut);
    });

    const buff = await fs.readFile(tmpFileOut);
    await fs.unlink(tmpFileOut).catch(err => console.error("Erro ao excluir arquivo temporário de saída:", err));
    await fs.unlink(tmpFileIn).catch(err => console.error("Erro ao excluir arquivo temporário de entrada:", err));
    return buff;
}

// Função para adicionar metadados EXIF
async function writeExif(media, metadata, isVideo = false, rename = false) {
    const wMedia = rename ? media : await convertToWebp(media, isVideo);
    const tmpFileIn = generateTempFileName('webp');
    const tmpFileOut = generateTempFileName('webp');

    await fs.writeFile(tmpFileIn, wMedia);

    if (metadata.packname || metadata.author) {
        const img = new webp.Image();
        const json = {
            "sticker-pack-id": `https://github.com/hiudyy`,
            "sticker-pack-name": metadata.packname,
            "sticker-pack-publisher": metadata.author,
            "emojis": ["NazuninhaBot"]
        };
        const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
        const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8");
        const exif = Buffer.concat([exifAttr, jsonBuff]);
        exif.writeUIntLE(jsonBuff.length, 14, 4);

        await img.load(tmpFileIn);
        await fs.unlink(tmpFileIn).catch(err => console.error("Erro ao excluir arquivo temporário de entrada:", err));
        img.exif = exif;
        await img.save(tmpFileOut);
        return tmpFileOut;
    }
}

// Função principal para enviar sticker
const sendSticker = async (nazu, jid, { sticker: path, type = 'image', packname = '', author = '', effect = null, rename = false }, { quoted } = {}) => {
    if (!type || !['image', 'video'].includes(type)) {
        throw new Error('O tipo de mídia deve ser "image" ou "video".');
    }

    let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : fs2.existsSync(path) ? await fs2.readFileSync(path) : path.url ? await getBuffer(path.url) : Buffer.alloc(0);

    let buffer;
    if (packname || author) {
        buffer = await writeExif(buff, { packname, author }, type === 'video', rename);
    } else {
        buffer = await convertToWebp(buff, type === 'video', effect);
    }

    await nazu.sendMessage(jid, { sticker: { url: buffer }, ...(packname || author ? { packname, author } : {}) }, { quoted });
    return buffer;
};

module.exports = {
    sendSticker
};