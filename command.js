// require the config.json module
const { prefix } = require('./config.json')

module.exports = (client, aliases, callback) => {
    // hat der Benuter Wörter geschrieben
    if (typeof aliases === 'string') {
        // Variable von typedef wird der aliases Variable übergeben
        aliases = [aliases]
    }

    // Wenn Benutzer eine Nachricht sendet
    client.on('message', message => {
        const { content } = message;

        // Die Nachricht wird geglieder mit dem prefix und dem Befehl
        aliases.forEach(alias => {
            const command = `${prefix}${alias}`

            if (content.startsWith(`${command} `) || content === command) {
                console.log(`Running the command ${command}`)
                callback(message)
            }
        })
    })
}