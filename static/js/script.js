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

function badge(color="purple"){
    return '<div class="badge"><svg height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 47.94 47.94" xml:space="preserve"><path style="fill:#fff;" d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"/></svg></div>'
}

const nickname = 'PlayQuartz';
const token = 'oauth:hflg6jsthewec1shlv4ybnc5rfxu58';  // Generate this from Twitch
const channel = '#aussieantics';

const ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

var message_list = []

function create_display(user_message){

    let message = user_message.message
    let username = user_message["display-name"]

    div = document.createElement("div")
    div.classList.add("message_container")

    div.addEventListener("click", function(event){
        if (event.target.classList.contains("message")){
            event.target.parendNode.remove()
        }
        else{
            event.target.remove()
        }
        handle_declick(user_message)
    })

    div2 = document.createElement("div")
    div2.classList.add("message")
    div2.setAttribute('contenteditable', 'false');

    usertext = document.createElement("b")
    usertext.innerText = username+": "

    div2.append(usertext)
    div2.append(message)
    div.append(div2)

    return div
}

async function handle_declick(user_message){
    message_list.forEach((unit_message, index) =>{
        if(unit_message.id == user_message.id){
            message_list.splice(index, 1)
        }
    })
    wss.send("remove_message"+JSON.stringify(user_message))
}

async function handle_click(user_message){
    console.log(message_list)
    var duplicate = false
    message_list.forEach(unit_message =>{
        if(unit_message.id == user_message.id){
            duplicate = true
        }
    })
    if(!duplicate){
        message_list.push(user_message)
        wss.send("add_message"+JSON.stringify(user_message))
        display = await create_display(user_message)
        document.querySelector(".container.display").append(display)
    }
}

function create_message(user_message){

    let message = user_message.message
    let username = user_message["display-name"] 
    let color =  user_message.color
    let hasBadge = user_message.badges.includes("subscriber")

    div = document.createElement("div")
    div.classList.add("message_container")

    div.addEventListener("click", function(){
        handle_click(user_message)
    })

    if(hasBadge){
        div.innerHTML = badge()
    }

    div2 = document.createElement("div")
    div2.classList.add("message")
    div2.setAttribute('contenteditable', 'false');

    usertext = document.createElement("b")
    usertext.style.color = color
    usertext.innerText = username+": "

    div2.append(usertext)
    div2.append(message)
    div.append(div2)

    return div
}

const wss = new WebSocket('ws://localhost:8080/test');

wss.onopen = () => {
    console.log('Connected to WebSocket server');
};

wss.onmessage = (event) => {
    console.log('Message from server:', event.data);
};

wss.onclose = () => {
    console.log('Disconnected from WebSocket server');
};

ws.onopen = function(event) {
    ws.send(`PASS ${token}`);
    ws.send(`NICK ${nickname}`);
    ws.send(`JOIN ${channel}`);
    ws.send('CAP REQ :twitch.tv/tags');
};

ws.onmessage = function(event) {
    const messageContainer = document.querySelector('.chat');
    const second_container = document.querySelector('.second_container');
    const message = event.data;
    user_message = {}
    if (event.data.includes("PRIVMSG")){

        double_point_split = event.data.split(":")
        if(double_point_split.length > 3){
            double_point_split[0] += double_point_split[1]
            double_point_split.splice(1,1)
        }

        variables = double_point_split[0].split(";")

        for (element in variables){
            split = variables[element].split("=")
            user_message[split[0]] = split[1]
        }

        user_message["message"] = double_point_split[2]

        div = create_message(user_message)
        messageContainer.append(div);

        const isNearBottom = second_container.scrollHeight - second_container.scrollTop <= second_container.clientHeight + 50;
        if (isNearBottom) {
            second_container.scrollTop = second_container.scrollHeight;
        }
    }


    if (message.startsWith('PING')) {
        ws.send('PONG :tmi.twitch.tv');
    }
};

ws.onerror = function(error) {
    console.error(`WebSocket Error: ${error}`);
};

ws.onclose = function(event) {
    console.log('WebSocket connection closed');
};
  
