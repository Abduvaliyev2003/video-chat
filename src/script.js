const APP = "9f8a63f363ef4312aac6042fbe7c1b4f";
const TOKEN = "007eJxTYFj0rE2+g+XvZJHFMr0RN/j+Hn/8qMDx9xr1xfXFyy6+yt+qwGCZZpFoZpxmbGacmmZibGiUmJhsZmBilJaUap5smGSSJvfjZGpDICND4aJKVkYGCATx2RmSMxLz8lJzGBgAiO8jxA=="  
const CHANNEL = "channel"
  const client = AgoraRTC.createClient({mode:"rtc", codec:"vp8"});


let localTracks = {
    videoTrack: null,
    audioTrack: null
}

let remotetrocks = {};

async function join()
{
    client.on('user-published', handleUserJoined);
    let UID =  await client.join(APP, CHANNEL, TOKEN, null);
    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

    let player = `<div class="video-container" id="user-container-${UID}">
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
    remotetrocks[user.uid] = user;

    // Subscribe to the new user's tracks
    await client.subscribe(user, mediaType);

    // Check the number of users
    const currentUsersCount = Object.keys(remotetrocks).length;

    if (currentUsersCount > 1) {
        // If there are more than one user, remove the additional user
        handleInvalidUser(user);
        return;
    }

    // Continue with the code for handling user publication
    // ...

    if (mediaType === 'video') {
        let player = document.getElementById(`user-container-${user.uid}`);
        if (player != null) {
            player.remove();
        }

        player = `<div class="video-container" id="user-container-${user.uid}">
                        <div class="video-player" id="user-${user.uid}">
                         </div>
                  </div>`;

        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player);

        user.videoTrack.play(`user-${user.uid}`);
    }

    if (mediaType === 'audio') {
        user.audioTrack.play();
    }
}
function handleInvalidUser(user) {
    // Log a message indicating the invalid user
    console.log(`Invalid user ${user.uid}. Removing.`);

    // Remove the user's tracks and DOM elements
    removeUser(user);

    // Show an error message to the user
    showErrorToUser();

    // Alternatively, you might want to disconnect the client or take other actions
    // Disconnecting the client (this is just an example, adjust as needed)
    disconnectClient();
}

function removeUser(user) {
    // Remove user's tracks from the client
    client.unsubscribe(user);

    // Remove corresponding DOM elements
    const userContainer = document.getElementById(`user-container-${user.uid}`);
    if (userContainer) {
        userContainer.remove();
    }

    // You can add more logic based on your requirements
}

function showErrorToUser() {
    // Show an error message to the user (you can customize this based on your UI)
    alert("Invalid user. Only one-on-one calls are allowed.");
}

function disconnectClient() {
    // Disconnect the client (adjust this based on your Agora RTC client handling)
    client.leave();

    // You might want to perform additional cleanup or actions here
}

let handleUserLeft = async (user) => {
    delete remotetrocks[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}
 
let leaveAndRemoveLocalStream  = async () => {
    for(let i = 0; localTracks.lenght > i;i++)
    {
        localTracks[i].stop()
        localTracks[i].close()
    }

    await client.leave()
    document.getElementById('join-btn').style.display = 'none'
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


document.getElementById('join-btn').addEventListener('click', joinStream);
document.getElementById('leave-btn').addEventListener('click', leaveAndRemoveLocalStream);
document.getElementById('mic-btn').addEventListener('click', toggleMic);
document.getElementById('camera-btn').addEventListener('click', toggleCamera);



