from flask import Flask, render_template, jsonify, request
from threading import Thread
import pyaudio
import wave
import os
import whisper
from transformers import pipeline

app = Flask(__name__)
recording = False
frames = []
bullet_points = []
model = whisper.load_model("base")
AUDIO_FILE = "temp.wav"

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")


def save_audio(frames):
    # Save the audio data to a WAV file
    with wave.open(AUDIO_FILE, 'wb') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(pyaudio.PyAudio().get_sample_size(pyaudio.paInt16))
        wf.setframerate(44100)
        wf.writeframes(b''.join(frames))


def transcribe_audio():
    # Transcribe the audio using Whisper
    if os.path.exists(AUDIO_FILE):
        result = model.transcribe(AUDIO_FILE)
        transcript = result['text']
        os.remove(AUDIO_FILE)
        return transcript
    return "No audio file found."


def extract_bullet_points(transcript):
    custom_prompt = f"Extract the key points: {
        transcript} and return it just as a string with each point separated by a period."

    points = []
    summaries = summarizer(custom_prompt, max_length=50,
                           min_length=25, do_sample=False)
    for summary in summaries:
        points.append(summary['summary_text'])
    return points


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/bullet_points')
def get_bullet_points():
    return jsonify({'bullet_points': bullet_points})


@app.route('/start_recording', methods=['POST'])
def start_recording():
    global recording, frames
    recording = True
    frames = []
    return jsonify({'status': 'Recording started'})


@app.route('/stop_recording', methods=['POST'])
def stop_recording():
    global recording, bullet_points
    recording = False
    save_audio(frames)
    transcript = transcribe_audio()
    bullet_points = extract_bullet_points(transcript)
    return jsonify({'status': 'Recording stopped', 'transcript': transcript, 'bullet_points': bullet_points})


def run_flask():
    app.run(debug=True, use_reloader=False)


if __name__ == "__main__":
    flask_thread = Thread(target=run_flask)
    flask_thread.start()

    audio = pyaudio.PyAudio()
    stream = audio.open(format=pyaudio.paInt16,
                        channels=1,
                        rate=44100,
                        input=True,
                        frames_per_buffer=2048)  # Increase buffer size to 2048

    while True:
        if recording:
            try:
                data = stream.read(2048, exception_on_overflow=False)
                frames.append(data)
            except OSError as e:
                print(f"Error during recording: {e}")
