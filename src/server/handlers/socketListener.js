const logger = (message) => {console.log(`[Socket] ${message}`)}
class SocketListener {
    constructor(server) {
        this.io = require('socket.io')(server)

        // Initialize namespaces
        this.commentSpace = this.io.of('/comments')
        this.notificationSpace = this.io.of('/notifications')
        this.start_listeners()
    }

    start_listeners() {
        this.comments_listener()
        this.notification_listener()
    }

    comments_listener() {
        this.commentSpace.on('connection', function (socket) {

            socket.on('joinRoom', function (room) {
                logger(`join room event room id: ${room}`)
                if(room) {
                    logger('Connect to comments space')
                    socket.join(room)
                }
            })

            socket.on('leaveRoom', function (room) {
                logger(`Leave room event room id: ${room}`)
                socket.leave(room)
            })

            socket.on('comment', function (msg) {
                logger(`Add a comment to file:${msg.roomId}`)
                // Sends to all clients in 'roomId' room except sender
                socket.to(msg.roomId).emit('update', msg.comment)
            })

            socket.on('error', function (err) {
                console.error(err)
            })
        })

    }

    notification_listener() {
        this.notificationSpace.on('connection', function (socket) {
            //users subscribe to this channel when they log on the first time
            //room names will be their userIds
            socket.on('joinRoom', function (room) {
                if(room) {
                    logger('Connect to notification space')
                    socket.join(room)
                }
            })
            socket.on('leaveRoom', function (room) {
                socket.leave(room)
            })

            socket.on('getNotifications', function (msg) {
                logger('Listen to notifications')
                socket.to(msg.target).emit('notify',msg)
                return
            })
        })
    }
}

module.exports = SocketListener
