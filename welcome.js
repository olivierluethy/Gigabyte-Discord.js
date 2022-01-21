module.exports = (client, leaveReason) => {
    const channelId = '802576699442462730' // welcome channel
    const targetChannelId = '808008421404049419' // rules and info

    // Wenn Benutzer den Server betritt
    client.on('guildMemberAdd', (member) => {
        console.log(member)

        const message = `Please welcome <@${member.id}> to the server! Please check out ${member.guild.channels.cache.get(targetChannelId).toString()}`

        const channel = member.guild.channels.cache.get(channelId)
        channel.send(message)
    })

    // Wenn Benutzer den Server verlässt
    client.on('guildMemberRemove', (member) => {
        console.log('client on remove')
        console.log('member:', member)
        console.log('leaveReason:', leaveReason)
        // Ist die leaveReson gleich ban?
        if (leaveReason == "ban") {
            const message = `<@${member.id}> has been banned from the server!`
            const channel = member.guild.channels.cache.get(channelId)
            channel.send(message)
        } else if (leaveReason == "kick") { // Ist leaveReson gleich kick
            const message = `<@${member.id}> has been kicked from the server!`
            const channel = member.guild.channels.cache.get(channelId)
            channel.send(message)
        } else { // wenn nichts zutrifft wird einfach das ausgeführt
            const message = `<@${member.id}> just left the server!!`
            const channel = member.guild.channels.cache.get(channelId)
            channel.send(message)
        }
    })
}