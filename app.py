from flask import Flask, render_template, request, jsonify
import webbrowser
import threading
import time
from agent import ask_openrouter
from promptBuilder import PromptBuilder
import csvConverter
from embeddingRetriever import retriever
import signal
import sys

def shutdown_handler(signum, frame):
    print("Shutting down gracefully...")
    sys.exit(0)

signal.signal(signal.SIGINT, shutdown_handler)
signal.signal(signal.SIGTERM, shutdown_handler)


app = Flask(__name__)

@app.route("/")
def index():
  return render_template("hara.html")

@app.route("/test", methods=["POST"])
def test():
  print("✅ Hello from Flask!")  # This will be printed in your terminal
  return jsonify({"message": "Message received by Flask, I like big butts!"})

@app.route("/test22", methods=["POST"])
def test22():
  
  return jsonify({"message": "Option A: This is Option A\nOption B: This is Option B\nOption C: THis is Option C"})

@app.route("/request_ai_field_suggestion", methods=["POST"])
def request_ai_field_suggestion():
  json_data = request.get_json()
  #print("sendJson() recieved: ", json_data)

  template = PromptBuilder(json_data)

  test_run = False
  if test_run:
    return jsonify({"aiFieldSuggestion": "test_run is active"})
  
  try:
    ai_field_suggestion =  ask_openrouter(template)
    return jsonify({"aiFieldSuggestion": ai_field_suggestion})
  except Exception as e:
    print("Error cought in @app.route()")
    return jsonify({"error": str(e)}), 500
  

@app.route("/export_hara_to_csv", methods=["POST"])
def export_hara_to_csv():
  json_data = request.get_json()
  json_data = csvConverter.remove_incomplete_rows(json_data)
  csvConverter.export_hara_to_csv(json_data)
  return {"status": "success"}


def open_browser():
  webbrowser.open_new("http://127.0.0.1:5000")

if __name__ == "__main__":
  threading.Timer(1.25, open_browser).start()  # Open browser shortly after server starts
  app.run(debug=False)