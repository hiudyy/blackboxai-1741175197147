// Import all RPG systems
const {
    miningSystem,
    farmingSystem,
    fishingSystem,
    cookingSystem,
    craftSystem,
    questSystem,
    achievementSystem,
    dungeonSystem,
    raidSystem,
    bossSystem,
    factionSystem,
    territorySystem,
    gangSystem,
    investmentSystem,
    casinoSystem,
    shopSystem,
    classSystem,
    careerSystem,
    randomEventsSystem,
    playerExists,
    checkRPGAction,
    savePlayer
} = require('./rpg-imports.js');

// Main RPG command handler
const rpgCommands = async (type, nazu, from, sender, info, reply, command, q, prefix) => {
    // Verifica se RPG está ativo
    if (!isModoRpg) return reply('❌ O modo RPG está desativado!');

    // Processa eventos aleatórios
    const events = randomEventsSystem.checkForEvents();
    if (Object.keys(events).length > 0) {
        reply(randomEventsSystem.formatEventList());
    }

    switch(command) {
        // Comandos Básicos
        case 'registrar': {
            if (playerExists(sender)) return reply('❌ Você já está registrado!');
            if (!q) return reply(`❌ Digite seu nome. Exemplo: ${prefix}registrar Aventureiro`);
            
            try {
                const player = {
                    id: sender,
                    name: q,
                    level: 1,
                    xp: 0,
                    money: {
                        wallet: 1000,
                        bank: 0
                    },
                    stats: {
                        health: 100,
                        maxHealth: 100,
                        energy: 100,
                        maxEnergy: 100,
                        attack: 10,
                        defense: 5,
                        speed: 10
                    },
                    inventory: [],
                    createdAt: Date.now()
                };
                
                savePlayer(sender, player);
                reply(`✅ Bem-vindo ao RPG, ${q}!\n\nUse ${prefix}rpgmenu para ver os comandos.`);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'perfil': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            
            try {
                const player = await checkRPGAction(sender);
                let text = `👤 *PERFIL* 👤\n\n`;
                text += `Nome: ${player.name}\n`;
                text += `Nível: ${player.level}\n`;
                text += `XP: ${player.xp}/${player.level * 1000}\n\n`;
                
                text += `💰 *DINHEIRO*\n`;
                text += `├ Carteira: R$ ${player.money.wallet}\n`;
                text += `└ Banco: R$ ${player.money.bank}\n\n`;
                
                text += `📊 *STATS*\n`;
                text += `├ Vida: ${player.stats.health}/${player.stats.maxHealth}\n`;
                text += `├ Energia: ${player.stats.energy}/${player.stats.maxEnergy}\n`;
                text += `├ Ataque: ${player.stats.attack}\n`;
                text += `├ Defesa: ${player.stats.defense}\n`;
                text += `└ Velocidade: ${player.stats.speed}\n\n`;

                if (player.class) {
                    const classInfo = classSystem.classes[player.class];
                    text += `🎮 *CLASSE*\n`;
                    text += `└ ${classInfo.name}\n\n`;
                }

                if (player.faction) {
                    const factionInfo = factionSystem.factions[player.faction.id];
                    text += `⚔️ *FACÇÃO*\n`;
                    text += `└ ${factionInfo.name}\n\n`;
                }

                if (player.gang) {
                    text += `🎭 *GANGUE*\n`;
                    text += `└ ${player.gang.name}\n\n`;
                }

                if (player.career) {
                    const careerInfo = careerSystem.careers[player.career.id];
                    text += `💼 *CARREIRA*\n`;
                    text += `└ ${careerInfo.name}\n\n`;
                }

                reply(text);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        // [Previous commands from rpg-commands-enhanced.js]
        // [Previous commands from rpg-commands-enhanced-2.js]
        // [Previous commands from rpg-commands-enhanced-3.js]
        // [Previous commands from rpg-commands-enhanced-4.js]
        // [Previous commands from rpg-commands-enhanced-5.js]

        // Menu Command
        case 'rpgmenu': {
            let text = `🎮 *RPG MENU* 🎮\n\n`;
            
            text += `*COMANDOS BÁSICOS*\n`;
            text += `├ ${prefix}registrar - Criar personagem\n`;
            text += `├ ${prefix}perfil - Ver seu perfil\n`;
            text += `└ ${prefix}inventario - Ver inventário\n\n`;
            
            text += `*SISTEMAS DE COLETA*\n`;
            text += `├ ${prefix}minerar - Minerar recursos\n`;
            text += `├ ${prefix}pescar - Pescar\n`;
            text += `├ ${prefix}plantar - Cultivar plantas\n`;
            text += `└ ${prefix}cozinhar - Preparar comidas\n\n`;
            
            text += `*SISTEMAS DE COMBATE*\n`;
            text += `├ ${prefix}dungeon - Explorar dungeons\n`;
            text += `├ ${prefix}raid - Participar de raids\n`;
            text += `└ ${prefix}boss - Lutar contra bosses\n\n`;
            
            text += `*SISTEMAS SOCIAIS*\n`;
            text += `├ ${prefix}faccao - Sistema de facções\n`;
            text += `├ ${prefix}territorio - Controle de territórios\n`;
            text += `└ ${prefix}gangue - Sistema de gangues\n\n`;
            
            text += `*SISTEMAS ECONÔMICOS*\n`;
            text += `├ ${prefix}investir - Fazer investimentos\n`;
            text += `├ ${prefix}casino - Jogos de azar\n`;
            text += `└ ${prefix}loja - Comprar itens\n\n`;
            
            text += `*OUTROS SISTEMAS*\n`;
            text += `├ ${prefix}missoes - Ver missões\n`;
            text += `├ ${prefix}carreira - Sistema de trabalho\n`;
            text += `└ ${prefix}craft - Criar itens\n\n`;
            
            text += `Use ${prefix}ajuda <comando> para mais informações.`;
            
            reply(text);
        }
        break;

        // Help Command
        case 'ajuda': {
            if (!q) return reply(`❌ Digite o comando. Exemplo: ${prefix}ajuda minerar`);
            
            let text = '';
            switch(q.toLowerCase()) {
                case 'minerar':
                    text = `⛏️ *COMANDO: ${prefix}minerar*\n\n`;
                    text += `Uso: ${prefix}minerar <local>\n`;
                    text += `Exemplo: ${prefix}minerar mina_carvao\n\n`;
                    text += `Locais disponíveis:\n`;
                    Object.entries(miningSystem.locations).forEach(([id, loc]) => {
                        text += `├ ${id} (Nível ${loc.level})\n`;
                    });
                    break;
                // ... Add help text for other commands
                default:
                    text = `❌ Comando não encontrado!`;
            }
            
            reply(text);
        }
        break;
    }
};

module.exports = rpgCommands;
