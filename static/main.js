const socket = io();
let pc;
let stream;

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const bulletPointsDiv = document.getElementById('bulletPoints');

startBtn.addEventListener('click', startRecording);
stopBtn.addEventListener('click', stopRecording);

async function startRecording() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        pc = new RTCPeerConnection();

        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        pc.onicecandidate = event => {
            if (event.candidate) {
                socket.emit('ice_candidate', event.candidate);
            }
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket.emit('offer', { sdp: pc.localDescription.sdp, type: pc.localDescription.type });

        socket.on('answer', async (answer) => {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
        });

        socket.emit('start_recording');
        startBtn.disabled = true;
        stopBtn.disabled = false;
    } catch (error) {
        console.error('Error starting recording:', error);
    }
}

async function stopRecording() {
    if (pc) {
        pc.close();
    }
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    socket.emit('stop_recording', (response) => {
        console.log(response);
        displayBulletPoints(response.bullet_points);
    });
    startBtn.disabled = false;
    stopBtn.disabled = true;
}

function displayBulletPoints(points) {
    bulletPointsDiv.innerHTML = '';
    points.forEach(point => {
        const p = document.createElement('p');
        p.textContent = point;
        bulletPointsDiv.appendChild(p);
    });
}

async function fetchBulletPoints() {
    const response = await fetch('/bullet_points');
    const data = await response.json();
    displayBulletPoints(data.bullet_points);
}

setInterval(fetchBulletPoints, 5000);  // Fetch bullet points every 5 seconds

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});