const NotificationHandler = {}
const defaultTitle = 'New notification'
//type classifies whether it is a comemnt ,share, file upload notifcaiont
//data determins logic for onClick events, ie link to comment
NotificationHandler.createNotification = (type, data, callback) => {
    let title = defaultTitle
    let options = {
        body: '',
        icon: '',
    }
    switch (type) {
        case 'comment':
            options.body = data.content
            title = 'new Comment from ' + data.target
            Notification.requestPermission(function (permission) {
                if (permission == 'granted') {
                    let commentNotify = new Notification(title, options)
                    commentNotify.onclick = function () {
                        callback(data)
                    }
                    setTimeout(commentNotify.close.bind(commentNotify), 5000)
                    return
                } else {
                    return
                }
            })
            break
        case 'share':
            options.body = 'You can now view' + data.sender +"'s file"
            title = data.sender + ' shared a file with you'
            Notification.requestPermission(function (permission) {
                if (permission == 'granted') {
                    let commentNotify = new Notification(title, options)
                    commentNotify.onclick = function () {
                        callback(data)
                    }
                    setTimeout(commentNotify.close.bind(commentNotify), 5000)
                    return
                } else {
                    return
                }
            })
            break
    }
}

export default NotificationHandler
