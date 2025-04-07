from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import pickle
import numpy as np
import logging
import os


app = Flask(__name__, static_folder='../frontend')
CORS(app)


logging.basicConfig(level=logging.DEBUG)


models_path = 'models'
try:
    diabetes_model = pickle.load(open(os.path.join(models_path, 'diabetes.pkl'), 'rb'))
    logging.info("Diabetes model loaded successfully.")
except (FileNotFoundError, pickle.UnpicklingError) as e:
    diabetes_model = None
    logging.error(f"Error loading diabetes model: {e}")

try:
    heart_model = pickle.load(open(os.path.join(models_path, 'heart_disease_model.pkl'), 'rb'))
    logging.info("Heart disease model loaded successfully.")
except (FileNotFoundError, pickle.UnpicklingError) as e:
    heart_model = None
    logging.error(f"Error loading heart disease model: {e}")

try:
    parkinson_model = pickle.load(open(os.path.join(models_path, 'parkinsons_model(1).pkl'), 'rb'))
    logging.info("Parkinson's model loaded successfully.")
    
except (FileNotFoundError, pickle.UnpicklingError) as e:
    parkinson_model = None
    logging.error(f"Error loading Parkinson's model: {e}")

# Serve frontend files
@app.route('/')
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_files(path):
    return send_from_directory(app.static_folder, path)

@app.route('/predict/diabetes', methods=['POST'])
def predict_diabetes():
    if not diabetes_model:
        return jsonify({'error': 'Diabetes model not available'}), 500
    
    data = request.json
    logging.debug(f"Received data for diabetes: {data}")

    if not data or 'data' not in data:
        return jsonify({'error': 'No data provided for diabetes prediction'}), 400

    try:
       
        diabetes_data = data['data'][0].split(',')
        diabetes_data = [float(i) for i in diabetes_data]
        logging.debug(f"Parsed diabetes data: {diabetes_data}")

      
        if len(diabetes_data) != diabetes_model.n_features_in_:
            logging.error(f"Incorrect input dimensions: Expected {diabetes_model.n_features_in_}, got {len(diabetes_data)}")
            return jsonify({'error': 'Incorrect input dimensions for diabetes prediction'}), 400

       
        prediction = diabetes_model.predict(np.array([diabetes_data]))[0]
        logging.debug(f"Diabetes model prediction raw output: {prediction}")

       
        result = "The person is diabetic" if prediction >= 0.5 else "The person is not diabetic"
    except Exception as e:
        logging.error(f"Error in diabetes prediction: {e}")
        return jsonify({'error': 'Diabetes prediction failed due to an internal error.'}), 500

    return jsonify({'prediction': result})


@app.route('/predict/heart', methods=['POST'])
def predict_heart():
    if not heart_model:
        return jsonify({'error': 'Heart disease model not available'}), 500
    
    data = request.json
    logging.debug(f"Received data for heart disease: {data}")

    if not data or 'data' not in data:
        return jsonify({'error': 'No data provided for heart disease prediction'}), 400

    try:
        heart_data = data['data'][0].split(',')
        heart_data = [float(i) for i in heart_data]
        logging.debug(f"Parsed heart disease data: {heart_data}")
        
        prediction = heart_model.predict(np.array([heart_data]))[0]
        result = "The person has heart disease" if prediction >= 0.5 else "The person does not have heart disease"
    except Exception as e:
        logging.error(f"Error in heart disease prediction: {e}")
        return jsonify({'error': 'Heart disease prediction failed due to an internal error.'}), 500

    return jsonify({'prediction': result})

@app.route('/predict/parkinsons', methods=['POST'])
def predict_parkinson():
    if not parkinson_model:
        return jsonify({'error': 'Parkinson\'s model not available'}), 500
    
    data = request.json
    logging.debug(f"Received data for Parkinson's disease: {data}")

    if not data or 'data' not in data:
        return jsonify({'error': 'No data provided for Parkinson\'s prediction'}), 400

    try:
        parkinson_data = data['data'][0].split(',')
        parkinson_data = [float(i) for i in parkinson_data]
        logging.debug(f"Parsed Parkinson's data: {parkinson_data}")
        
        prediction = parkinson_model.predict(np.array([parkinson_data]))[0]
        result = "The person has Parkinson's disease" if prediction >= 0.5 else "The person does not have Parkinson's disease"
    except Exception as e:
        logging.error(f"Error in Parkinson's prediction: {e}")
        return jsonify({'error': 'Parkinson\'s prediction failed due to an internal error.'}), 500

    return jsonify({'prediction': result})

if __name__ == '__main__':
    app.run(debug=True)
