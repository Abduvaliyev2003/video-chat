<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="./src/style.css">
</head>
<body>

    <button id="join-btn">Join Stream</button>

    <div class="stream-wrapper">
         <div id="video-streams" ></div>

         <div id="stream-controls">
            <button id="leave-btn">Leave Stream</button>
            <button id="mic-btn">Mic on</button>
            <button id="camera-btn">Camera on</button>
         </div>
    </div>
    <!-- <main>
       <div class="container">
           <div id="participants">
                <div id="me" class="participant">
                   
                </div>
                
           </div>
       </div>

    </main> -->

<script src="src/AgoraRTC_N-4.20.0.js"></script>
<script src="src/script.js"></script>
</body>
</html>