const feed_container = document.querySelector(".main_container")

function add_message(message_data){

    let message_container = document.createElement("div")
    let message = document.createElement("div")

    message_container.classList.add("message_container")
    message.classList.add("message")
    message.setAttribute('contenteditable', 'false');
    
    message.innerHTML = `<b style='color:${message_data.color}'>${message_data["display-name"]}: </b>"${message_data.message}`

    message_container.append(message)

    feed_container.append(message_container)
}

function update_feed(json_data){
    feed_container.innerHTML = ""
    json_data.forEach(message =>{
        add_message(message)
    })
}


const wss = new WebSocket('ws://localhost:8080/'+window.location.search.split("=")[1]);

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