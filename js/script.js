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

// ----------TEMPORARY THINGS
let streams = document.querySelector('button#streams');
let users = document.querySelector('button#users');
//let link = document.querySelector('a');
//streams.onclick = getStreams;
//users.onclick = getUsers;
// ----------TEMPORARY THINGS

// Gets user information from set list of usernames - displays all users, regardless of live or offline.
function getUsers() {
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
//        console.log(resp, userID_users);
        getStreams();
    }
}

// Gets streams based on the set list of usersnames - only displays live streams.
function getStreams() {
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
        console.log(userID_streams);
        buildLinks();
    }
}

// Finds out which users are live by comparing userIDs from 'streams' and 'users' - adds matching to `liveUsers` object.
function checkLiveUsers() {
    for (let a of userID_users) {
        for (let b of userID_streams) {
            if (a.id == b.user_id) {
                liveUsers[`${a.display_name}`] = [a, b];
                return true;
            }
        }
    }
}

// Checks if current user [passed as param] is currently live
function checkIfLive(user){
    for(let key of userID_streams){
        if(key.user_id == user.id){
            return true;
        }
    }
}

// Creates links to each profile - opens in a new tab
function buildLinks() {
//    getStreams();
    let userList = document.querySelector('ul');
    userID_users.forEach(elem => {
        let listItem = document.createElement('li');
        let listLink = document.createElement('a');
        let userImg = document.createElement('img');
        let userStatus = document.createElement('p');

        listLink.href = `https://twitch.tv/${elem.login}`;
        listLink.textContent = `${elem.display_name}`;
        listLink.setAttribute('target', '_blank');

        userImg.src = `${elem.profile_image_url}`;

        if(checkIfLive(elem)){
            userStatus.textContent = 'Live';
        } else{
            userStatus.textContent = 'Offline';
        }

//        console.log(elem);

        listItem.appendChild(listLink);
        listItem.appendChild(userStatus);
        listItem.appendChild(userImg);
        userList.appendChild(listItem);
    })
}

(function () {
    getUsers();
})();






//  Future: Add search functionality
