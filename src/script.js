const APP = "9f8a63f363ef4312aac6042fbe7c1b4f";
const TOKEN = "007eJxTYHgSIlRwSiHyPPfSymKrhzFTX3P5yUur3dnCsyw3vWLC0lwFBss0i0Qz4zRjM+PUNBNjQ6PExGQzAxOjtKRU82TDJJO0vLVnUhsCGRm+XjnIyMgAgSA+O0NyRmJeXmoOAwMAciEhBA=="  
const CHANNEL = "channel"
  const client = AgoraRTC.createClient({mode:"rtc", codec:"vp8"});


let localTracks = {
    videoTrack: null,
    audioTrack: null
}

let remotetrocks = {};
let currentIndex = 0;

async function join()
{
    client.on('user-published', handleUserJoined);
    let UID =  await client.join(APP, CHANNEL, TOKEN, null);
    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

    let player = `<div class="video-container" id="user-container-${UID}">
                  <div class="uid" >
                    ${UID}
                  </div>
                    <div class="video-player" id="user-${UID}">
                    </div>
    
                </div>`;
    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player) 
    localTracks[1].play(`user-${UID}`)   
    
    await client.publish([localTracks[0], localTracks[1]])
}

let joinStream  = async () => {
    await join();

    document.getElementById('join-btn').style.display = 'none'
    document.getElementById('stream-controls').style.display = 'flex'

}

let handleUserJoined = async (user, mediaType ) => {
    remotetrocks[user.uid] = user
    await client.subscribe(user, mediaType)

    if(mediaType === 'video')
    {
        let player = document.getElementById(`user-container-${user.uid}`)
        if(player != null)
        {
            player.remove()
        }

        player = `<div class="video-container" id="user-container-${user.uid}">
        <div class="uid" >
        ${user.uid}
        </div>
                        <div class="video-player" id="user-${user.uid}">
                         </div>
                  </div>`;

         document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)
         
         user.videoTrack.play(`user-${user.uid}`)
    }

    if(mediaType  === 'audio')
    {
        user.audioTrack.play()
    }
}





let handleUserLeft = async (user) => {
   delete remotetrocks[user.uid];
    document.getElementById(`user-container-${user.uid}`).remove();
    
    // Switch to a new random user when the current user leaves
    switchToRandomUser();

}
 
let leaveAndRemoveLocalStream  = async () => {
    for(let i = 0; localTracks.lenght > i;i++)
    {
        localTracks[i].stop()
        localTracks[i].close()
    }

    await client.leave()
    document.getElementById('join-btn').style.display = 'block'
    document.getElementById('stream-controls').style.display = 'none'
    document.getElementById('video-streams').innerHTML = ''
}

let toggleMic = async (e) => {
    if(localTracks[0].muted){
        await localTracks[0].setMuted(false)
        e.target.innerText = 'Mic on'
        e.target.style.backgroundColor = 'cadetblue'

    } else  {
        await localTracks[0].setMuted(true)
        e.target.innerText = 'Mic off'
        e.target.style.backgroundColor = '#EE4B2B'
    }
}

let toggleCamera = async (e) => {
    if(localTracks[1].muted)
    {
        await localTracks[1].setMuted(false)
        e.target.innerText = 'Camera on'
        e.target.style.backgroundColor = 'cadetblue'
    } else {
        await localTracks[1].setMuted(true)
        e.target.innerText = 'Camera off'
        e.target.style.backgroundColor = '#EE4B2B'
    }
}

function getRandomUserId() {
    const userIds = Object.keys(remotetrocks);
    return userIds[Math.floor(Math.random() * userIds.length)];
}

async function switchToRandomUser() {
    const randomUserId = getRandomUserId();
    switchToUser(randomUserId);
}

async function switchToUser(userId) {
    // Implement logic to switch to the specified user
    const user = remotetrocks[userId];
    // You may want to stop and remove the current localTracks video before switching
    localTracks[1].stop();
    localTracks[1].close();

    // Play the video of the selected user
    user.videoTrack.play(`user-${user.uid}`);
}


console.log(localTracks);
document.getElementById('join-btn').addEventListener('click', joinStream);
document.getElementById('leave-btn').addEventListener('click', leaveAndRemoveLocalStream);
document.getElementById('mic-btn').addEventListener('click', toggleMic);
document.getElementById('next-btn').addEventListener('click', switchToRandomUser);
document.getElementById('camera-btn').addEventListener('click', toggleCamera);


