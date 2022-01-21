// require the discord.js module
const Discord = require('discord.js');

// require the config.json module
const { prefix, token, giphyToken } = require('./config.json');

// require the command.js module
const command = require('./command')

// require the welcome.js module
const welcome = require('./welcome')

// require the role-claim.js module
const roleClaim = require('./role-claim')

// Initialiserung der konstanten Variable channelId
const channelId = '802576699442462730' // welcome channel

// Initialiserung der konstanten Variable targetChannelId
const targetChannelId = '808008421404049419' // rules and info

// Initialisierung der Variable leaveReason
let leaveReason = ""; // wird gebraucht um den Grund des verlassen des Servers festzulegen

// require the giphy-js-sdk-core pack
var GphApiClient = require('giphy-js-sdk-core') // wird gebraucht für die GIF's
giphy = GphApiClient(giphyToken)

// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
    console.log('Ready!');

    roleClaim(client)

    // Zeigt im Status was man eingeben muss um Hilfe zu bekommen
    client.user.setPresence({
        activity: {
            name: `"${prefix}help" for help`,
        },
    })
});

// wenn jemand vom Server eine Nachricht schreibt schaut der Bot die Nachrichten an
client.on('message', message => {
    //console.log(message.content);

    // hat der Benutzer ping geschrieben?
    if (message.content.startsWith(`${prefix}ping`)) {

        // wenn ja, Bot schreibt Pong. zurück
        message.channel.send('Pong.');
    }
    // das genau gleiche wie bei der ersten If-Klause
    else if (message.content.startsWith(`${prefix}beep`)) {
        message.channel.send('Boop.');
    } else if (message.content.startsWith(`${prefix}serverinfo`)) {
        //message.channel.send('Coming soon')
        const { guild } = message

        const { name, region, memberCount, owner, afkTimeout } = guild
        const icon = guild.iconURL()

        // eine neue Einbettung wird erstellt
        const embed = new Discord.MessageEmbed()

            // Titel der Einbettung wird festgelegt
            .setTitle(`Server info for "${name}"`)

            // Das Thumbnail wird festgelegt
            .setThumbnail(icon)

            // Felder werden erstellt
            .addFields(
                {
                    name: 'Region',
                    value: region,
                },
                {
                    name: 'Members',
                    value: memberCount,
                },

                {
                    name: 'Owner',
                    value: owner.user.tag,
                },
                {
                    name: 'AFK Timeout',
                    value: afkTimeout / 60,
                }
            )

        // Der Bot sendet das Embed, nachdem der Benutzer sudo serverinfo geschrieben hat
        message.channel.send(embed)
    } else if (message.content.startsWith(`${prefix}help`)) {
        // Gibt Informationen zum Bot selber
        message.channel.send(`
These are my supported commands:

**sudo help** - Displays the help menu
**sudo serverinfo** - Gives you informations about the server
**sudo userinfo** - Gives informations about the user
**sudo server** - Gives the name and the number of members
**sudo status** - Can select the status of the bot
**sudo cc** or **sudo clearchannel** - Clears the channel (only possible to use if you have the rights)
**sudo createtextchannel** - Can create a text channel (only possible to use if you have the rights)
**sudo createvoicechannel** - Can create a voice channel (only possible to use if you have the rights)
**sudo kick + username** - Kicks people (only possible to use if you have the rights)
**sudo ban + username** - Bans people (only possible to use if you have the rights)
        `)
    } else if (message.content.startsWith(`${prefix}userinfo`)) {
        // Um Sachen im Chat vom Server einzubetten
        //console.log(message.author)
        var version = '1.0.1';

        const embed = new Discord.MessageEmbed()
            .setTitle('User Information')
            .addField('Player Name', message.author.username, true)
            .addField('Version', version, true)
            .addField('Current Server', message.guild.name, true)
            .setColor('#00AAFF')
            .setThumbnail(message.author.avatarURL())
            .setFooter('Subscribe to my youtube!')

        message.channel.send(embed)
    } else if (message.content.startsWith(`${prefix}createtextchannel`)) {

        // Hat der Benutzer das Recht ADMINISTRATOR?
        if (message.member.hasPermission('ADMINISTRATOR')) {
            const name = message.content.replace('sudo createtextchannel ', '')

            // ein Textkanal wird erstellt
            message.guild.channels
                .create(name, {
                    type: 'text',
                })
                .then((channel) => {
                    // Die Kategorie in welcher der Kanal reinmuss
                    const categoryId = '799937270193848391'
                    channel.setParent(categoryId)
                })
        } else {
            // Falls Benutzer nicht ADMINISTRATOR ist, gibt der Bot diese Nachricht zurück
            message.channel.send('You dont have the permission to use this command!')
        }
    } else if (message.content.startsWith(`${prefix}createvoicechannel`)) {
        // Hat der Benutzer das Recht ADMINISTRATOR?
        if (message.member.hasPermission('ADMINISTRATOR')) {
            const name = message.content.replace('sudo createvoicechannel ', '')

            // ein Sprachkanal wird erstellt
            message.guild.channels
                .create(name, {
                    type: 'voice',
                })
                .then((channel) => {
                    const categoryId = '799937270193848391'
                    channel.setParent(categoryId)
                    channel.setUserLimit(10)
                })
        } else {
            // Falls Benutzer nicht ADMINISTRATOR ist, gibt der Bot diese Nachricht zurück
            message.channel.send('You dont have the permission to use this command!')
        }
    }
    // Hat der Benutzer sudo clearchannel oder sudo cc geschrieben? 
    else if (message.content.startsWith(`${prefix}clearchannel`) || message.content.startsWith(`${prefix}cc`)) {
        // wenn ja, ist der Benutzer ADMINISTRATOR?
        if (message.member.hasPermission('ADMINISTRATOR')) {
            message.channel.messages.fetch().then((results) => {
                message.channel.bulkDelete(results) // Löscht Textnachrichten die weniger als 14 Tage alt sind, massenweise löschen.
            })
        } else {
            // Falls Benutzer nicht ADMINISTRATOR ist, gibt der Bot diese Nachricht zurück
            message.channel.send('You dont have the permission to do that!')
        }
    } else if (message.content.startsWith(`${prefix}status`)) {
        const content = message.content.replace('sudo status ', '')
        // der Bot setzt das was nach sudo status eingegeben wurde als sein Status
        client.user.setPresence({
            activity: {
                name: content,
                type: 0,
            },
        })
    } else if (message.content.startsWith(`${prefix}server`)) {
        // Zeigt an wie der Server heisst und wie viele drin sind
        client.guilds.cache.forEach((guild) => {
            // Der Bot gibt den Namen und die Anzahl Mitglieder des Servers bekannt
            message.channel.send(
                `${guild.name} has a total of ${guild.memberCount} members`
            )
        })
    } else if (message.content.startsWith(`${prefix}ban`)) {
        const { member, mentions } = message

        const tag = `<@${member.id}>`

        if (
            member.hasPermission('ADMINISTRATOR') ||
            member.hasPermission('BAN_MEMBERS')
        ) {
            const target = mentions.users.first()
            if (target) { // existiert der Benutzer welcher gebannt werden muss?
                const target = mentions.users.first()
                const targetMember = message.guild.members.cache.get(target.id) // die Id des Benutzers wird ermittelt
                targetMember.ban() // Benuter wird gebannt
                leaveReason = "ban" // Der Grund weshalb die Person den Server verlassen hat wird notiert
                welcome(client, leaveReason) // die Welcome-Funktion wird aufgerufen

                // Das GIF wird erstellt
                giphy.search('gifs', { "q": "user has been banned" })
                    .then((response) => {
                        var totalResponses = response.data.length;
                        var responseIndex = Math.floor((Math.random() * 10) + 1) % totalResponses;
                        var responseFinal = response.data[responseIndex]

                        // Der Bot gibt das zurück
                        message.channel.send(":wave: " + targetMember.displayName + " has been banned!", {
                            files: [responseFinal.images.fixed_height.url]
                        })
                    }).catch(() => {
                        message.channel.send('Error ugh!');
                    })
                return leaveReason
            } else { // Falls die Person die gebannt werden muss nicht gefunden wurde oder keine Person ausgewählt wurde
                message.channel.send(`${tag} Please specify someone to ban`)
            }
        }
        else {
            // Falls die Person das Recht nicht hat
            message.channel.send(
                `${tag} You dont have permission to use this command.`
            )
        }
    }

    // Bei kick ist es genau das gleiche wie bei ban, nur wird anstelle von gebannnt gekickt
    else if (message.content.startsWith(`${prefix}kick`)) {
        const { member, mentions } = message

        const tag = `<@${member.id}>`

        if (
            member.hasPermission('ADMINISTRATOR') ||
            member.hasPermission('KICK_MEMBERS')
        ) {
            const target = mentions.users.first()
            if (target) {
                const targetMember = message.guild.members.cache.get(target.id)
                targetMember.kick()
                leaveReason = "kick";

                console.log('\n\n leaveReason', leaveReason)
                welcome(client, "kick")

                giphy.search('gifs', { "q": "kick" })
                    .then((response) => {
                        var totalResponses = response.data.length;
                        var responseIndex = Math.floor((Math.random() * 10) + 1) % totalResponses;
                        var responseFinal = response.data[responseIndex]

                        message.channel.send(":wave: " + targetMember.displayName + " has been kicked!", {
                            files: [responseFinal.images.fixed_height.url]
                        })
                    }).catch(() => {
                        message.channel.send('Error ugh!');
                    })
            } else {
                message.channel.send(`${tag} Please specify someone to kick`)
            }
        }
        else {
            message.channel.send(
                `${tag} You dont have permission to use this command.`
            )
        }
    } else if (message.content.startsWith(`${prefix}react`)) {
        message.react(`😀`);
    }

    else if (message.content) { // Falls nichts von den Argumenten zutrifft, wird überprüft, ob der Benutzer überhaupt was geschrieben hat
        const { member, mentions } = message

        const tag = `<@${member.id}>`
        // Ein Array mit all den Wörtern die er überprüfen muss
        const profanity = ['fuck', 'piss off', 'dick head', 'asshole', 'son uf a bitch', 'bitch', 'bugger', 'choad', 'crikey', 'wanker', 'motherfucker']

        // Wörter werden gesucht
        const profane = !!profanity.find((word) => {
            const regex = new RegExp(`\\b${word}\\b`, 'i'); // if the phrase is not alphanumerical,
            return regex.test(message.content);             // you may need to escape tokens
        });

        if (profane) { // entspricht das Wort des Benutzers mit einem des Arrays?
            message.channel.send(`${tag} Please dont write that!`)

            // Nachricht wird gelöscht
            return message.delete()
                .catch(console.error);
        }
    }
});

// login to Discord with your app's token
client.login('__REDACTED_DISCORD_TOKEN__');