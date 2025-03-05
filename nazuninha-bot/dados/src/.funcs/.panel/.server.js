const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config.json')));
const port = config.panelPort || 2012;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '.views'));

// Serve static files
app.use(express.static(path.join(__dirname, '.public')));

// Bot stats object
let botStats = {
    startTime: Date.now(),
    groups: 0,
    commandsExecuted: 0,
    messagesReceived: 0,
    messagesSent: 0,
    premiumUsers: []
};

// Get premium users with enhanced error handling
function getPremiumUsers() {
    const premiumPath = path.join(__dirname, '../../..', 'database', 'dono', 'premium.json');
    let premiumUsers = [];
    
    try {
        if (fs.existsSync(premiumPath)) {
            const premiumData = JSON.parse(fs.readFileSync(premiumPath, 'utf8'));
            premiumUsers = Object.entries(premiumData)
                .filter(([_, isActive]) => isActive)
                .map(([userId, _]) => {
                    // Get user's pushname from group data
                    let pushname = 'Unknown User';
                    const groupsPath = path.join(__dirname, '../../..', 'database', 'grupos');
                    if (fs.existsSync(groupsPath)) {
                        const groupFiles = fs.readdirSync(groupsPath);
                        for (const groupFile of groupFiles) {
                            try {
                                const groupData = JSON.parse(fs.readFileSync(path.join(groupsPath, groupFile), 'utf8'));
                                if (groupData.contador) {
                                    const userEntry = groupData.contador.find(entry => entry.id === userId);
                                    if (userEntry && userEntry.pushname) {
                                        pushname = userEntry.pushname;
                                        break;
                                    }
                                }
                            } catch (e) {
                                console.error(`Error reading group file ${groupFile}:`, e);
                            }
                        }
                    }

                    return {
                        id: userId,
                        name: pushname,
                        expiresAt: 'Premium',
                        avatar: '/img/default-avatar.png'
                    };
                });
        }
    } catch (err) {
        console.error('Error reading premium users file:', err);
    }
    
    return premiumUsers;
}

// Enhanced group details function
function getGroupDetails(groupId, detailed = false) {
    try {
        const groupPath = path.join(__dirname, '../../..', 'database', 'grupos', `${groupId}.json`);
        if (!fs.existsSync(groupPath)) return null;

        const data = JSON.parse(fs.readFileSync(groupPath, 'utf8'));
        
        // Calculate stats from contador
        let totalMessages = 0;
        let totalCommands = 0;
        if (data.contador) {
            for (const user of data.contador) {
                totalMessages += user.msg || 0;
                totalCommands += user.cmd || 0;
            }
        }

        // Basic group info
        const basicInfo = {
            id: groupId,
            name: data.name || 'Unknown Group',
            members: data.members || 0,
            image: data.image || '/img/default-group.png'
        };

        if (!detailed) return basicInfo;

        // Get top 5 users from contador
        const topUsers = data.contador ? 
            data.contador
                .map(user => ({
                    pushname: user.pushname || 'Unknown User',
                    number: user.id.replace(/(\d{4})\d+/, '$1********').split('@')[0],
                    messages: user.msg || 0
                }))
                .sort((a, b) => b.messages - a.messages)
                .slice(0, 5) : [];

        // Enhanced information for detailed view
        return {
            ...basicInfo,
            description: data.desc || 'No description available',
            adminCount: Array.isArray(data.admins) ? data.admins.length : 0,
            stats: {
                messagesReceived: totalMessages,
                commandsExecuted: totalCommands,
                messagesSent: totalMessages
            },
            systems: {
                antilink: data.antilinkgp || false,
                welcome: data.bemvindo || false,
                antiflood: data.antiflood || false
            },
            topUsers
        };
    } catch (err) {
        console.error(`Error getting group details for ${groupId}:`, err);
        return null;
    }
}

// Initialize bot stats from database and group counters
function initBotStats() {
    try {
        botStats.startTime = Date.now();
        
        // Calculate totals from group data
        let totalMessages = 0;
        let totalCommands = 0;
        const groupsPath = path.join(__dirname, '../../..', 'database', 'grupos');
        if (fs.existsSync(groupsPath)) {
            const groupFiles = fs.readdirSync(groupsPath);
            botStats.groups = groupFiles.length;
            
            for (const groupFile of groupFiles) {
                try {
                    const groupData = JSON.parse(fs.readFileSync(path.join(groupsPath, groupFile), 'utf8'));
                    if (groupData.contador) {
                        for (const user of groupData.contador) {
                            totalMessages += user.msg || 0;
                            totalCommands += user.cmd || 0;
                        }
                    }
                } catch (e) {
                    console.error(`Error reading group file ${groupFile}:`, e);
                }
            }
        }

        // Update stats
        botStats.messagesReceived = totalMessages;
        botStats.commandsExecuted = totalCommands;
        botStats.messagesSent = totalMessages;
        botStats.premiumUsers = getPremiumUsers();
    } catch (err) {
        console.error('Error initializing bot stats:', err);
    }
}

// Update bot stats
function updateStats() {
    try {
        // Calculate totals from group data
        let totalMessages = 0;
        let totalCommands = 0;
        const groupsPath = path.join(__dirname, '../../..', 'database', 'grupos');
        if (fs.existsSync(groupsPath)) {
            const groupFiles = fs.readdirSync(groupsPath);
            botStats.groups = groupFiles.length;
            
            for (const groupFile of groupFiles) {
                try {
                    const groupData = JSON.parse(fs.readFileSync(path.join(groupsPath, groupFile), 'utf8'));
                    if (groupData.contador) {
                        for (const user of groupData.contador) {
                            totalMessages += user.msg || 0;
                            totalCommands += user.cmd || 0;
                        }
                    }
                } catch (e) {
                    console.error(`Error reading group file ${groupFile}:`, e);
                }
            }
        }

        // Update stats
        botStats.messagesReceived = totalMessages;
        botStats.commandsExecuted = totalCommands;
        botStats.messagesSent = totalMessages;
        botStats.premiumUsers = getPremiumUsers();

        // Save stats
        const statsPath = path.join(__dirname, '../../..', 'database', 'panel', 'stats.json');
        fs.writeFileSync(statsPath, JSON.stringify(botStats, null, 2), 'utf8');
    } catch (err) {
        console.error('Error updating stats:', err);
    }
}

// Routes
app.get('/', (req, res) => {
    updateStats();
    res.render('.dashboard', { stats: botStats });
});

app.get('/groups', (req, res) => {
    try {
        const groupsPath = path.join(__dirname, '../../..', 'database', 'grupos');
        let groups = [];
        
        if (fs.existsSync(groupsPath)) {
            const files = fs.readdirSync(groupsPath);
            groups = files
                .filter(file => file.endsWith('.json'))
                .map(file => {
                    try {
                        const groupId = file.replace('.json', '');
                        const data = JSON.parse(fs.readFileSync(path.join(groupsPath, file), 'utf8'));
                        return {
                            id: groupId,
                            name: data.name || groupId,
                            members: data.members || 0,
                            image: data.image || '/img/default-group.png',
                            active: true
                        };
                    } catch (e) {
                        console.error(`Error reading group file ${file}:`, e);
                        return null;
                    }
                })
                .filter(group => group !== null);
        }
        
        res.render('.groups', { groups });
    } catch (err) {
        console.error('Error fetching groups:', err);
        res.status(500).send('Error fetching groups');
    }
});

app.get('/group/:id', (req, res) => {
    try {
        const group = getGroupDetails(req.params.id, true);
        if (!group) {
            res.status(404).send('Group not found');
            return;
        }
        res.render('.group-details', { group });
    } catch (err) {
        console.error('Error fetching group details:', err);
        res.status(500).send('Error fetching group details');
    }
});

app.get('/api/stats', (req, res) => {
    updateStats();
    res.json(botStats);
});

// Initialize stats when server starts
initBotStats();

// Export server functions
module.exports = {
    startServer: () => {
        app.listen(port, () => {
            console.log(`Panel running on port ${port}`);
        });
    }
};
