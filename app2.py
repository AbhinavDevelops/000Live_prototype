from flask import Flask, jsonify
from flask_cors import CORS
from threading import Thread, Timer
import pyaudio
import wave
import os
import whisper

app = Flask(__name__)
cors = CORS(app, origins='*')


################################################# ROUTES ##############################

@app.route("/api/users", methods=['GET'])
def users():
    return jsonify(
        {
            "users": [
                'arpan',
                'zach',
                'jessie'
            ]
        }
    )

@app.route("/api/hello", methods=["GET"])
def hello():
    return jsonify({"message": "Hello from Flask!"})

# @app.route("/api/getTranscription")
# def get_transcription():
#     return "Transcription here."


################################################# UTILITY ##############################

recording = True
frames = []
model = whisper.load_model("base")
AUDIO_FILE = "temp.wav"

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

def audio_stream():
    audio = pyaudio.PyAudio()
    stream = audio.open(format=pyaudio.paInt16,
                        channels=1,
                        rate=44100,
                        input=True,
                        frames_per_buffer=2048)

    def print_transcript():
        if recording:
            # Save audio temporarily to get partial transcription
            save_audio(frames)
            result = model.transcribe(AUDIO_FILE)
            transcript = result['text']
            print(transcript)
            # Schedule the next call to this function
            Timer(5.0, print_transcript).start()

    print_transcript()  # Start the transcription printing loop

    while True:
        if recording:
            try:
                data = stream.read(2048, exception_on_overflow=False)
                frames.append(data)
            except OSError as e:
                print(f"Error during recording: {e}")

if __name__ == "__main__":
#     audio_thread = Thread(target=audio_stream)
#     audio_thread.start()

    app.run(debug=True, port=8080)