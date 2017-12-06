// Socket.io Utils
// ---

const io = require('socket.io-client')

const SocketHandler = {}

SocketHandler.log = (message) => console.log(`[Socket] ${message}`)

SocketHandler.start = () => {
    SocketHandler.commentSocket = io('/comments')
    SocketHandler.notificationSocket = io('/notifications')
}

/**
 * @param {string} namespace for the same endpoint but different namespace
 * @param {string} roomId
 */
SocketHandler.joinRoom = (namespace, roomId) => {
    SocketHandler.log(`[${namespace}] Joining room: ${roomId}`)
    switch (namespace) {
        case 'comments':
            SocketHandler.commentSocket.emit('joinRoom',  roomId)
            break
        case 'notifications':
            SocketHandler.notificationSocket.emit('joinRoom', roomId)
            break
        default:
            SocketHandler.log('No matching namespace')
    }
}

/**
 * @param {string} namespace for the same endpoint but different namespace
 * @param {string} roomId
 */
SocketHandler.leaveRoom = (namespace, roomId) => {
    SocketHandler.log(`[${namespace}] Leaving room: ${roomId}`)

    switch (namespace) {
        case 'comments':
            SocketHandler.commentSocket.off('update')
            SocketHandler.commentSocket.emit('leaveRoom', `${roomId}`)
            break
        case 'notifications':
            SocketHandler.notificationSocket.emit('leaveRoom', `${roomId}`)
            break
        default:
            SocketHandler.log('No matching namespace')
    }
}

/**
 * @param {string} namespace for the same endpoint but different namespace
 * @param {string} event event name
 * @param {string} data event data
 */
SocketHandler.emitEvent = (namespace, event, data) => {
    SocketHandler.log(`[${namespace}] Emitting event: ${event}`)

    switch (namespace) {
        case 'comments':
            SocketHandler.commentSocket.emit(event, data)
            break
        case 'notifications':
            console.log('socket handler')

            SocketHandler.notificationSocket.emit(event, data)
            break
        default:
            SocketHandler.log('No matching namespace')
    }
}


/**
 * @param {string} namespace for the same endpoint but different namespace
 * @param {string} event
 * @param {function} callback
 */
SocketHandler.listen = (namespace, event, callback) => {
    SocketHandler.log(`[${namespace}] Listening to ${event}`)

    switch (namespace) {
        case 'comments':
            SocketHandler.commentSocket.on(event, (message) => {
                SocketHandler.log(`${event} triggered: ${message}`)
                callback(message)
            })
            break
        case 'notifications':
            SocketHandler.notificationSocket.on(event, (data) => {
                SocketHandler.log(`${event} triggered`)
                callback(data)
            })
            break
        default:
            SocketHandler.log('No matching namespace')
    }
}

export default SocketHandler
