from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from keras.models import load_model
import numpy as np
from PIL import Image
from io import BytesIO

app = Flask(__name__)
CORS(app, resources={r'/predict': {'origins': 'http://127.0.0.1:5173', 'methods': ['POST']}})


# Load AlexNet model from pickle file
alexnet_model = load_model("alexnet_travelohi_v6.h5")

@app.route('/', methods=['GET'])
def hello():
  return 'Tes tes tes'

@app.route('/predict', methods=['POST'])
def predict():
  # Ambil gambar dari request
  # image_path = "test3.jpg"
  file = request.files['image']
  image = Image.open(BytesIO(file.read()))
  
  # Proccess
  image = image.resize((227, 227))
  image_array = np.array(image)
  image_array = np.expand_dims(image_array, axis=0)

  # Lakukan prediksi dengan model
  prediction = alexnet_model.predict(image_array)

  # # Lakukan prediksi dengan model
  # prediction = alexnet_model.predict(image)

  img_class = ""
  if np.argmax(prediction) == 0:
    img_class = "Brazil"
  elif np.argmax(prediction) == 1:
    img_class = "Canada"
  elif np.argmax(prediction) == 2:
    img_class = "Finland"
  elif np.argmax(prediction) == 3:
    img_class = "Japan"
  elif np.argmax(prediction) == 4:
    img_class = "United Kingdom"
  elif np.argmax(prediction) == 5:
    img_class = "United States"

  # Ubah hasil prediksi ke format yang sesuai
  result = {
    'class': img_class
  }

  response = jsonify(result)

  return response

if __name__ == '__main__':
  app.run(debug=True)
