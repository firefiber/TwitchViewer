//ClientID: mmsj66xshsa6xtk024r136cawnweyw
//Twitch API endpoint: https://api.twitch.tv/helix/
//Generate link to live stream: https://twitch.tv/streams/:stream.id/channel/:stream.user_id

//List:

//Streams: /streams?
//Username: user_login=
//UserID: user_id=
//Limits: first=
//Live: type=live|vodcast|""
//Next: after=
//Back: before=

//RESPONSE
//Thumbs: .thumbnail_url [width]x[height];
//GameID: .game_id
//Title: .title
//Viewers: .viewer_count

const setList = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
const endpoint = "https://api.twitch.tv/helix/";
let userID_streams = [];
let userID_users = [];
let liveUsers = {};
let request = new XMLHttpRequest();

//TEMPORARY THINGS
let streams = document.querySelector('button#streams');
let users = document.querySelector('button#users');
let link = document.querySelector('a');

// Gets streams based on the set list of usersnames - only displays live streams.
streams.onclick = function () {
    const usernames = setList.map((elem) => {
        return `user_login=${elem}`;
    }).join("&");
    let reqType = 'streams?';
    request.open('GET', `${endpoint+reqType+usernames}`);
    request.setRequestHeader('Client-ID', "mmsj66xshsa6xtk024r136cawnweyw");
    request.send();

    request.onload = function () {
        let resp = JSON.parse(request.response);
        if (resp.data.length > 0) {
            resp.data.forEach(elem => userID_streams.push(elem));
        }
        console.log(resp, userID_streams);
    }
}

// Gets user information from set list of usernames - displays all users, regardless of live or offline.
users.onclick = function () {
    const usernames = setList.map((elem) => {
        return `login=${elem}`;
    }).join("&");
    let reqType = 'users?'
    request.open('GET', `${endpoint+reqType+usernames}`);
    request.setRequestHeader('Client-ID', "mmsj66xshsa6xtk024r136cawnweyw");
    request.send();

    request.onload = function () {
        let resp = JSON.parse(request.response);
        if (resp.data.length > 0) {
            resp.data.forEach(elem => userID_users.push(elem));
        }
        console.log(resp, userID_users);
        checkLiveUsers();
    }
}

// Finds out which users are live by comparing userIDs from 'streams' and 'users' - adds matching to `liveUsers` object.
function checkLiveUsers(){
    for (let a of userID_users){
        for(let b of userID_streams){
            if(a.id == b.user_id){
                liveUsers[`${a.display_name}`]=[a,b];
            }
        }
    }
}

