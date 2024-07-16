async function fetchBulletPoints() {
    const response = await fetch('/bullet_points');
    const data = await response.json();
    const bulletPointsDiv = document.getElementById('bullet-points');
    bulletPointsDiv.innerHTML = data.bullet_points.map(point => `<li>${point}</li>`).join('');
}

setInterval(fetchBulletPoints, 1000);

async function startRecording() {
    const response = await fetch('/start_recording', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data.status);
}

async function stopRecording() {
    const response = await fetch('/stop_recording', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data.status);
}
