from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit
from threading import Thread
import threading
import pyaudio
import wave
import os
import whisper
from transformers import pipeline
from aiortc import MediaStreamTrack, RTCPeerConnection, RTCSessionDescription
from aiortc.contrib.media import MediaBlackhole, MediaRecorder

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

recording = False
frames = []
bullet_points = []
model = whisper.load_model("base")
AUDIO_FILE = "temp.wav"
TRANSCRIPTION_FILE = "transcription.txt"

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

pcs = set()


class AudioTrack(MediaStreamTrack):
    kind = "audio"

    def __init__(self):
        print("AudioTrack __init__ called")
        super().__init__()
        self.recorder = MediaRecorder(AUDIO_FILE)

    async def recv(self):
        print("AudioTrack recv called")
        frame = await self.next_frame()
        await self.recorder.addFrame(frame)
        return frame


@app.route('/')
def index():
    return render_template('index.html')


@socketio.on('offer')
def handle_offer(offer):
    print("handle_offer called")
    socketio.start_background_task(process_offer, offer)


async def process_offer(offer):
    print("process_offer called")
    pc = RTCPeerConnection()
    pcs.add(pc)

    @pc.on("connectionstatechange")
    async def on_connectionstatechange():
        if pc.connectionState == "failed":
            await pc.close()
            pcs.discard(pc)

    @pc.on("track")
    def on_track(track):
        if track.kind == "audio":
            audio_track = AudioTrack()
            pc.addTrack(audio_track)

    await pc.setRemoteDescription(RTCSessionDescription(sdp=offer['sdp'], type=offer['type']))
    answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)

    emit('answer', {'sdp': pc.localDescription.sdp, 'type': pc.localDescription.type})

    # Start streaming audio data to the server
    audio = pyaudio.PyAudio()
    stream = audio.open(format=pyaudio.paInt16,
                        channels=1,
                        rate=44100,
                        input=True,
                        frames_per_buffer=2048)

    def send_audio_data():
        global frames
        while True:
            data = stream.read(2048)
            print("Sending audio data to server:", len(data))
            frames.append(data)
            socketio.sleep(0.01)  # Send audio data every 10ms

    socketio.start_background_task(send_audio_data)


@socketio.on('start_recording')
def start_recording():
    global recording, frames
    print("start_recording called")
    recording = True
    frames = []
    # Clear the transcription file when starting a new recording
    with open(TRANSCRIPTION_FILE, 'w') as f:
        f.write('')
    socketio.start_background_task(process_audio_and_transcribe)
    return {'status': 'Recording started'}


@socketio.on('stop_recording')
def stop_recording():
    global recording, bullet_points, frames
    print("stop_recording called")
    recording = False
    if frames:
        save_audio(frames)
        transcript = transcribe_audio()
        bullet_points = extract_bullet_points(transcript)
        frames = []
        return {'status': 'Recording stopped', 'transcript': transcript, 'bullet_points': bullet_points}
    return {'status': 'Recording stopped', 'transcript': 'No audio recorded', 'bullet_points': []}


@app.route("/api/hello", methods=["GET"])
def hello():
    return jsonify({"message": "Hello from Flask!"})


def save_audio(frames):
    print("Saving audio data to file...")
    with wave.open(AUDIO_FILE, 'wb') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(pyaudio.PyAudio().get_sample_size(pyaudio.paInt16))
        wf.setframerate(44100)
        wf.writeframes(b''.join(frames))
    print("Audio data saved to file.")


def transcribe_audio():
    print("Transcribing audio...")
    if os.path.exists(AUDIO_FILE):
        result = model.transcribe(AUDIO_FILE)
        transcript = result['text']
        os.remove(AUDIO_FILE)
        print("Transcription complete:", transcript)
        return transcript
    return "No audio file found."


def extract_bullet_points(transcript):
    print("extract_bullet_points called")
    custom_prompt = f"Extract the key points: {transcript} and return it just as a string with each point separated by a period."
    points = []
    summaries = summarizer(custom_prompt, max_length=50, min_length=25, do_sample=False)
    for summary in summaries:
        points.append(summary['summary_text'])
    return points


@app.route('/bullet_points')
def get_bullet_points():
    return jsonify({'bullet_points': bullet_points})


def process_audio_and_transcribe():
    global frames, recording
    print("Processing audio and transcribe started")
    while True:
        if recording and frames:
            print("Processing audio frames...")
            current_frames = frames.copy()
            frames.clear()
            save_audio(current_frames)
            transcript = transcribe_audio()
            print("Sending live transcription to client:", transcript)
            socketio.emit('live_transcript', {'transcript': transcript})
        socketio.sleep(1)  # Process every second


def run_flask():
    print("run_flask called")
    socketio.run(app, debug=True, use_reloader=False, port=5000, allow_unsafe_werkzeug=True)


if __name__ == "__main__":
    print("Application starting")
    flask_thread = Thread(target=run_flask)
    flask_thread.start()

    try:
        while True:
            socketio.sleep(1)
    except KeyboardInterrupt:
        print("Stopping the application...")
    finally:
        print("Application stopped.")
