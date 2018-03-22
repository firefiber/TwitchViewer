//ClientID: mmsj66xshsa6xtk024r136cawnweyw
//Twitch API endpoint: https://api.twitch.tv/kraken

  //List:

  //Streams: /streams
  //Featured: /streams/featured
  //Limits: ?limit=??&offsent=??
  //Live: &stream_type=live

//console.log("test");
//$.ajax({
//  type:'GET',
//  url:'https://api.twitch.tv/helix/streams',
//  dataType:'json',
//  headers:  {
//    'Client-ID':"mmsj66xshsa6xtk024r136cawnweyw"
//  }
//}).done(function(msg){
//    console.log(msg);
//});

//function json(){
        let endpoint = "https://api.twitch.tv/helix/streams";
        let request = new XMLHttpRequest();

        request.open('GET', endpoint);
        request.setRequestHeader('Client-ID', "mmsj66xshsa6xtk024r136cawnweyw")
        request.send();
        request.responseType='json';

        request.onload = function(){
            let resp = request.response;
            console.log(resp);
        }
//};


//
//
//    let mapsRequest = new XMLHttpRequest();
//
//    mapsRequest.open('GET', gmapsURL+"&latlng="+lat+","+lon);
//    mapsRequest.send();
//    mapsRequest.responseType = 'json';
//
//    mapsRequest.onload = function(){
//      locResp = mapsRequest.response;
//      showLocation(locResp);
//    }
