module.exports = {
    server: {
        fqdn: process.env.FQDN ? `https://${process.env.FQDN}` : 'http://localhost:8080',
        wsFqdn: process.env.FQDN ? `wss://${process.env.FQDN}` : 'ws://localhost:8080',
    },
}
