var websocketHub = {};

channelControllers.factory('channelService', [
    function () {
        var wsuri = 'ws://localhost/hub/open?';
        var Service = {};
        Service.websocket = {};

        Service.start = function (channel) {
            Service.websocket.conn = new WebSocket(wsuri + channel);

            Service.websocket.conn.onopen = function () {
                console.log("Socket has been opened!");
            };

            Service.websocket.conn.onmessage = function (message) {
                listener(JSON.parse(message.data));
            };

            Service.websocket.conn.onclose = function () {
                console.log("Connection closed");
                setTimeout(function () {
                    Service.websocket.conn = new WebSocket(wsuri + channel);
                }, 5000);
            };

            function listener(data) {
                var messageObj = data;
                console.log("Received data from websocket: ", messageObj);
                Service.callbackChannel(messageObj);
            }
        };

        Service.subscribeChannel = function (callback) {
            Service.callbackChannel = callback;
        };

        return Service;
    }
]);