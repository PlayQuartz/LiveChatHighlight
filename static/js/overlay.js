async function post_request(url, json_data) {
    try {
        const response = await fetch(config.request_server+url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(json_data)
        });
        return await response.json();
    } catch (error) {
        console.error("Error in post_request:", error);
        throw error;
    }
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


var socket = io.connect("http://127.0.0.1:5000");
socket.on('connect', function() {
    socket.send('message Hello world');
});

socket.on('message', function(msg) {
    console.log(msg)
});

