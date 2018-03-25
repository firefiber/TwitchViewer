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
let userID_streams = []; //Stores stream details from api call [for "setList" users] - only returns streams that are live.
let userID_users = []; //Stores user details from api call [for "setList" users].
let request = new XMLHttpRequest();


// ----------TEMPORARY THINGS

// ----------TEMPORARY THINGS

// Gets user information from set list of usernames - displays all users, regardless of live or offline.
function getUsers(userList) {
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
            resp.data.forEach(elem => {
                userID_users.push(elem)
            });

        }
        getStreams();
    }
}

// Gets streams based on the set list of usersnames - only displays live streams.
function getStreams(userList) {
    let gameIDs = [];
    const usernames = setList.map((elem) => {
        return `user_login=${elem}`;
    }).join("&");
    let reqType = 'streams?';
    request.open('GET', `${endpoint+reqType+usernames}`);
    request.setRequestHeader('Client-ID', "mmsj66xshsa6xtk024r136cawnweyw");
    request.send();

    request.onload = function () {
        /* After it's loaded, it'll check if the response is empty:
            If not, push each item into userID_streams, get all the 'game_id' values, put those into a string,
            and call getGameNames with that string as the 'id' parameter. 'buildLinks' will be called from there.

            If empty, call buildLinks.
        */
        let resp = JSON.parse(request.response).data;
        if (resp.length > 0) {
            resp.forEach(elem => {
                userID_streams.push(elem);
                gameIDs.push(elem.game_id)
            });
            const gameIDstring = gameIDs.map(elem => {
                return `id=${elem}`;
            }).join('&');
            getGameName(gameIDstring);

        } else buildLinks();

    }
}

// Make API call to get game info based on given game ID's - gets 'name' property and stores in userID_streams.Calls 'buildLinks' when done.
function getGameName(gameList) {
    const reqType = 'games?';
    request.open('GET', `${endpoint+reqType+gameList}`);
    request.setRequestHeader('Client-ID', "mmsj66xshsa6xtk024r136cawnweyw");
    request.send();

    request.onload = function () {
        let resp = JSON.parse(request.response).data;
        resp.forEach(elem => {
            for (let x of userID_streams) {
                if (x.game_id == elem.id) {
                    x.name = elem.name;
                }
            }
        });
        buildLinks();
    }
}

//Creates all the elements to display results on the page.
function buildLinks() {
    const content = document.querySelector('#content');
    /*  Checks if current user [passed as param] is currently live by matching userID's from 'streams' and 'users'
        For each user that's live, add a 'name' property to userID_stream with the name of the game being played. */
    userID_users.forEach(elem => {
        function checkIfLive(user) {
            for (let key of userID_streams) {
                if (key.user_id == user.id) {
                    userGame.textContent = key.name;
                    return true;
                }
            }
        }
        const mainDiv = document.createElement('div');
        const imgDiv = document.createElement('div');
        const textDiv = document.createElement('div');
        const userLinkText = document.createElement('p');
        const userLinkUrl = document.createElement('a');
        const userImg = document.createElement('img');
        const userStatus = document.createElement('p');
        const userGame = document.createElement('p');

        userLinkUrl.href = `https://twitch.tv/${elem.login}`;
        userLinkUrl.textContent = `${elem.display_name}`;
        userLinkUrl.setAttribute('target', '_blank');

        userImg.src = `${elem.profile_image_url}`;

        if (checkIfLive(elem)) {
            userStatus.textContent = 'Live';

        } else {
            userStatus.textContent = 'Offline';
        }

        userLinkText.appendChild(userLinkUrl);
        imgDiv.appendChild(userImg);
        textDiv.appendChild(userLinkText);
        textDiv.appendChild(userStatus);
        textDiv.appendChild(userGame);

        userLinkText.classList.add('username');
        userStatus.classList.add('status');
        userGame.classList.add('game');
        mainDiv.classList.add('stream');
        imgDiv.classList.add('stream_img');
        textDiv.classList.add('stream_desc');

        mainDiv.appendChild(imgDiv);
        mainDiv.appendChild(textDiv);
        content.appendChild(mainDiv);
    })
}

function getTop8(){
    let reqType = `streams?first=8`;
    request.open('GET', `${endpoint+reqType}`);
    request.setRequestHeader('Client-ID', "mmsj66xshsa6xtk024r136cawnweyw");
    request.send();

    request.onload = function(){
        let resp = JSON.parse(request.response).data;
        console.log(resp);
    }
}


(function () {
    getUsers();
})();




//  Future: Add search functionality

//// Finds out which users are live by comparing userIDs from 'streams' and 'users' - adds matching to `liveUsers` object.
//function checkLiveUsers() {
//    for (let a of userID_users) {
//        for (let b of userID_streams) {
//            if (a.id == b.user_id) {
//                liveUsers[`${a.display_name}`] = [a, b];
//                return true;
//            }
//        }
//    }
//}
