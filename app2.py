# from flask import Flask, jsonify
# from flask_cors import CORS
# from threading import Thread, Timer, Lock
# import pyaudio
# import wave
# import os
# import whisper
#
# app = Flask(__name__)
# cors = CORS(app, origins='*')
#
# locker = Lock()
#
# ################################################# ROUTES ##############################
#
# @app.route("/api/users", methods=['GET'])
# def users():
#     return jsonify(
#         {
#             "users": [
#                 'arpan',
#                 'zach',
#                 'jessie'
#             ]
#         }
#     )
#
# @app.route("/api/hello", methods=["GET"])
# def hello():
#     return jsonify({"message": "Hello from Flask!"})
#
# @app.route("/api/getTranscript")
# def get_transcription():
#     result = model.transcribe(AUDIO_FILE)
#     transcript = result['text']
#     return jsonify({"transcript": transcript})
#
#
# ################################################# UTILITY ##############################
#
# recording = True
# frames = []
# model = whisper.load_model("base")
# AUDIO_FILE = "temp.wav"
#
# def save_audio(frames):
#     # Save the audio data to a WAV file
#     with wave.open(AUDIO_FILE, 'wb') as wf:
#         wf.setnchannels(1)
#         wf.setsampwidth(pyaudio.PyAudio().get_sample_size(pyaudio.paInt16))
#         wf.setframerate(44100)
#         wf.writeframes(b''.join(frames))
#
#
# def transcribe_audio():
#     locker.acquire()
#     try:
#         if os.path.exists(AUDIO_FILE):
#             result = model.transcribe(AUDIO_FILE)
#             transcript = result['text']
#             os.remove(AUDIO_FILE)
#             return transcript
#         else:
#             return "No audio file found."
#     except Exception as e:
#         print(f"Exception during transcription: {e}")
#         return f"Error: {str(e)}"
#     finally:
#         locker.release()
#
# def audio_stream():
#     audio = pyaudio.PyAudio()
#     stream = audio.open(format=pyaudio.paInt16,
#                         channels=1,
#                         rate=44100,
#                         input=True,
#                         frames_per_buffer=2048)
#
#     def print_transcript():
#         if recording:
#             # Save audio temporarily to get partial transcription
#             save_audio(frames)
#             result = model.transcribe(AUDIO_FILE)
#             transcript = result['text']
#             print(transcript)
#             # Schedule the next call to this function
#             Timer(0.1, print_transcript).start()
#
#     print_transcript()  # Start the transcription printing loop
#
#     while True:
#         if recording:
#             try:
#                 data = stream.read(2048, exception_on_overflow=False)
#                 frames.append(data)
#             except OSError as e:
#                 print(f"Error during recording: {e}")
#
# if __name__ == "__main__":
#     audio_thread = Thread(target=audio_stream)
#     audio_thread.start()
#
#     app.run(debug=True, port=8080)

from flask import Flask, jsonify
from flask_cors import CORS
from threading import Thread
import pyaudio
import wave
import os
import whisper

app = Flask(__name__)
CORS(app, origins='*')

# Global control and storage
recording = True
frames = []
model = whisper.load_model("base")
AUDIO_FILE = "temp.wav"
transcript_queue = []

################################################# ROUTES ##############################

@app.route("/api/users", methods=['GET'])
def users():
    return jsonify({"users": ['arpan', 'zach', 'jessie']})

@app.route("/api/hello", methods=["GET"])
def hello():
    return jsonify({"message": "Hello from Flask!"})

@app.route("/api/getTranscript")
def get_transcription():
    if transcript_queue:
        return jsonify({"transcript": transcript_queue.pop(0)})
    return jsonify({"transcript": ""})


@app.route("/api/terminateCall", methods=['POST'])
def terminate_call():
    global recording, frames
    try:
        recording = False
        save_audio()
        transcript = transcribe_audio()
        return jsonify({'status': 'Recording stopped', 'transcript': transcript}), 200
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return jsonify({'status': 'Error', 'message': str(e)}), 500

@app.route("/api/restartCall", methods=['POST'])
def restart_call():
    global recording, audio_thread
    try:
        recording = True
        with open(AUDIO_FILE, 'wb') as f:
            pass
        if not audio_thread.is_alive():
            audio_thread = Thread(target=audio_stream)
            audio_thread.start()
        return jsonify({'status': 'Recording restarted'}), 200
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return jsonify({'status': 'Error', 'message': str(e)}), 500


################################################# AUDIO HANDLING ######################

def save_audio():
    with wave.open(AUDIO_FILE, 'wb') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(pyaudio.PyAudio().get_sample_size(pyaudio.paInt16))
        wf.setframerate(44100)
        wf.writeframes(b''.join(frames))
    frames.clear()

def audio_stream():
    audio = pyaudio.PyAudio()
    stream = audio.open(format=pyaudio.paInt16, channels=1, rate=44100, input=True, frames_per_buffer=2048)
    while recording:
        data = stream.read(2048, exception_on_overflow=False)
        frames.append(data)
        if len(frames) * 2048 >= 44100 * 2.5:
            save_audio()
            Thread(target=transcribe_audio).start()

def transcribe_audio():
    """ Transcribe audio file and handle exceptions. """
    try:
        if os.path.exists(AUDIO_FILE):

            result = model.transcribe(AUDIO_FILE, fp16=False, language='en')
            transcript_queue.append(result['text'])
            os.remove(AUDIO_FILE)
    except Exception as e:
        print(f"Exception during transcription: {e}")

if __name__ == "__main__":
    audio_thread = Thread(target=audio_stream)
    audio_thread.start()
    app.run(debug=True, port=8080)