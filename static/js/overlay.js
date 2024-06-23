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

const feed_container = document.querySelector(".main_container")

function add_message(message_data){

    let message_container = document.createElement("div")
    let username = document.createElement("div")
    let message = document.createElement("div")

    message_container.classList.add("message_container")
    username.classList.add("username")
    message.classList.add("message")

    username.innerHTML = message_data["display-name"]
    message.innerHTML = message_data.message

    message_container.append(username, message)

    feed_container.append(message_container)
}

function update_feed(json_data){
    feed_container.innerHTML = ""
    json_data.forEach(message =>{
        add_message(message)
    })
}


const wss = new WebSocket('ws://localhost:8080/test');

wss.onopen = () => {
    console.log('Connected to WebSocket server');
};

wss.onmessage = (event) => {
    json_data = JSON.parse(event.data)
    update_feed(json_data)

};

wss.onclose = () => {
    console.log('Disconnected from WebSocket server');
};