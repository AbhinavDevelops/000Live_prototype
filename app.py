# from flask import Flask, jsonify, request
# from threading import Thread, Timer
# import pyaudio
# import wave
# import os
# import whisper
# from flask_cors import CORS, cross_origin
#
# app = Flask(__name__)
# cors = CORS(app, origins='*')
#
# recording = True
# frames = []
# model = whisper.load_model("base")
# AUDIO_FILE = "temp.wav"
#
# @app.route("/", methods=["GET"])
# def home():
#     return "Home"
#
#
# @app.route("/api/hello", methods=["GET"])
# def hello():
#     return jsonify({"message": "Hello from Flask!"})
#
#
# @app.route('/api')
# def index():
#     return "Hello! Use API endpoints to start and stop recording."
#
#
# @app.route('/api/terminateCall', methods=['POST'])
# def stop_recording():
#     global recording, frames
#     try:
#         recording = False
#         save_audio(frames)
#         transcript = transcribe_audio()
#         return jsonify({'status': 'Recording stopped', 'transcript': transcript}), 200
#     except Exception as e:
#         print(f"An error occurred: {str(e)}")
#         return jsonify({'status': 'Error', 'message': str(e)}), 500
#
# @app.route('/api/getTranscript', methods=['GET'])
# def get_transcript():
#     transcript = transcribe_audio()
#     return jsonify({"transcript": transcript}), 200
#
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
#     # Transcribe the audio using Whisper
#     if os.path.exists(AUDIO_FILE):
#         result = model.transcribe(AUDIO_FILE)
#         transcript = result['text']
#         os.remove(AUDIO_FILE)
#         return transcript
#     return "No audio file found."
#
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
#             Timer(5.0, print_transcript).start()
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
#
# def run_flask():
#     app.run(debug=True, use_reloader=False, port=5000)
#
# if __name__ == "__main__":
#     run_flask()
# #     flask_thread = Thread(target=run_flask)
# #     flask_thread.start()
# #
# #     audio_thread = Thread(target=audio_stream)
# #     audio_thread.start()


# from flask import Flask, jsonify, request
# from threading import Thread, Timer
# import pyaudio
# import wave
# import os
# import whisper
# from flask_cors import CORS, cross_origin
#
# app = Flask(__name__)
# # cors = CORS(app, origins='*')
#
# recording = True
# frames = []
# model = whisper.load_model("base")
# AUDIO_FILE = "temp.wav"
#
# @app.route("/api/hello", methods=["GET"])
# def hello():
#     return jsonify({"message": "Hello from Flask!"})
#
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
#     # Transcribe the audio using Whisper
#     if os.path.exists(AUDIO_FILE):
#         result = model.transcribe(AUDIO_FILE)
#         transcript = result['text']
#         os.remove(AUDIO_FILE)
#         return transcript
#     return "No audio file found."
#
#
# @app.route('/')
# def index():
#     return "Hello! Use API endpoints to start and stop recording."
#
#
# @app.route('/api/terminateCall', methods=['POST'])
# def stop_recording():
#     global recording, frames
#     recording = False
#     save_audio(frames)
#     transcript = transcribe_audio()
#     return jsonify({'status': 'Recording stopped', 'transcript': transcript})
#
# @app.route('/api/getTranscript', methods=['GET'])
# def get_transcript():
#     transcript = transcribe_audio()
#     return jsonify({"transcript": transcript}), 200
#
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
#             Timer(5.0, print_transcript).start()
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
#
# def run_flask():
#     app.run(debug=True, port=5000)
#
# if __name__ == "__main__":
#     flask_thread = Thread(target=run_flask)
#     flask_thread.start()
#
#     audio_thread = Thread(target=audio_stream)
#     audio_thread.start()


# from flask import Flask, jsonify, request
# from threading import Thread, Timer
# import pyaudio
# import wave
# import os
# import whisper
#
# app = Flask(__name__)
# recording = True
# frames = []
# model = whisper.load_model("base")
# AUDIO_FILE = "temp.wav"
#
#
# @app.route("/api/hello", methods=["GET"])
# def hello():
#     return jsonify({"message": "Hello from Flask!"})
#
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
#     # Transcribe the audio using Whisper
#     if os.path.exists(AUDIO_FILE):
#         result = model.transcribe(AUDIO_FILE)
#         transcript = result['text']
#         os.remove(AUDIO_FILE)
#         return transcript
#     return "No audio file found."
#
#
# @app.route('/')
# def index():
#     return "Hello! Use API endpoints to start and stop recording."
#
#
# @app.route('/api/terminateCall', methods=['POST'])
# def stop_recording():
#     global recording, frames
#     recording = False
#     save_audio(frames)
#     transcript = transcribe_audio()
#     return jsonify({'status': 'Recording stopped', 'transcript': transcript})
#
#
# def run_flask():
#     app.run(debug=True, use_reloader=False, port=5000)
#
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
#             Timer(5.0, print_transcript).start()
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
#
# if __name__ == "__main__":
#     flask_thread = Thread(target=run_flask)
#     flask_thread.start()
#
#     audio_thread = Thread(target=audio_stream)
#     audio_thread.start()
