const setList = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
const endpoint = "https://api.twitch.tv/helix/";
let userID_streams = []; //Stores live streamer data (live status, game name, etc);
let userID_users = []; //Stores all streamer data (display name, profile img, etc);
let gameIDstring; // String of game ID's appended with 'id=' before each.
let userIDstring; // String of user ID's appended with 'id=' before each.
let topToggle = 0; // Check if TOP8 button pressed to stop new API calls.
let fccToggle = 0; // Check if FCC button pressed to stop new API calls.
let request = new XMLHttpRequest();
const content = document.querySelector('#content'); // Div where data is displayed. Cleared out on call.

// Gets user information from set list of usernames - displays all users, regardless of live or offline.
function getUsers(users) {
    let usernames;
    if (users == null) {
        usernames = setList.map((elem) => {
            return `login=${elem}`;
        }).join("&");
    } else usernames = users;

    const reqType = 'users?'
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
        if (gameIDstring == null) {
            getStreams();
        } else getGameName();
    }
}

// Gets streams based on the set list of usersnames - only displays live streams.
function getStreams(userList) {
    let gameIDs = [];
    const usernames = setList.map((elem) => {
        return `user_login=${elem}`;
    }).join("&");
    const reqType = 'streams?';
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

// Makes API call to get top 8 live streamers. Stores userIDs and gameIDs.
function getTop8() {
    let reqType = `streams?first=8`;
    request.open('GET', `${endpoint+reqType}`);
    request.setRequestHeader('Client-ID', "mmsj66xshsa6xtk024r136cawnweyw");
    request.send();

    request.onload = function () {
        let resp = JSON.parse(request.response).data;
        let uID = [];
        let gID = [];
        resp.forEach(elem => {
            uID.push(elem.user_id);
            gID.push(elem.game_id);
            userID_streams.push(elem);
        });
        userIDstring = uID.map(elem => {
            return `id=${elem}`;
        }).join('&');
        gameIDstring = gID.map(elem => {
            return `id=${elem}`;
        }).join('&');
        getUsers(userIDstring);
    }
}

// Make API call to get game info based on given game ID's - gets 'name' property and stores in userID_streams.Calls 'buildLinks' when done.
function getGameName(gameList) {
    let games;
    if (gameList == null) {
        games = gameIDstring;
    } else games = gameList;
    const reqType = 'games?';
    request.open('GET', `${endpoint+reqType+games}`);
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

// Creates all the elements to display results on the page.
function buildLinks() {
    content.innerHTML = "";
    /*  Checks if current user [passed as param] is currently live by matching userID's from 'streams' and 'users'
        For each user that's live, add a 'name' property to userID_stream with the name of the game being played. */
    userID_users.forEach(elem => {
        function checkIfLive(user) {
            for (let key of userID_streams) {
                if (key.user_id == user.id) {
                    if (key.name == null) {
                        userGame.textContent = "Not In Game."
                        return true;
                    } else {
                        userGame.textContent = "Game: " + key.name;
                        return true;
                    }
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
            userStatus.classList.add('status_live');
        } else {
            userStatus.textContent = 'Offline';
            userStatus.classList.add('status_offline');
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

// Checks if button was already pressed through toggle (topToggle). If pressed, stops. If not, clears all counters, and makes fresh API call to get users > game names > display data.
function topStreamers() {
    if (topToggle == 1) {
        return;
    } else {
        userID_users = [];
        userID_streams = [];
        gameIDstring = null;
        userIDstring = null;
        topToggle = 1;
        fccToggle = 0;
        getTop8();
    }
}

// Checks if button was already pressed through toggle (fccToggle). If pressed, stops. If not, clears all counters, and makes fresh API call to get users through set list.
function fccStreamers() {
    if (fccToggle == 1) {
        return;
    } else {
        userID_streams = [];
        userID_users = [];
        gameIDstring = null;
        userIDString = null;
        fccToggle = 1;
        topToggle = 0;

        getUsers();
    }

}

(function () {
    getUsers();

    const topBtn = document.getElementById('btn_top');
    const allBtn = document.getElementById('btn_all');

    topBtn.addEventListener('click', topStreamers);
    allBtn.addEventListener('click', fccStreamers);

    //    topBtn.onclick = topStreamers;
    //    allBtn.onclick = fccStreamers;
})();



// TODO: Add "loading" message when API call in progress
// TODO: Convert game name to title case
// Future: Add search functionality
