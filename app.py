from flask import Flask, jsonify, request, render_template
from datetime import datetime

app = Flask(__name__)

# Store high scores
scores = []

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/scores', methods=['GET'])
def get_scores():
    sorted_scores = sorted(scores, key=lambda x: x['score'], reverse=True)
    return jsonify({"scores": sorted_scores[:10]})  # Return top 10 scores

@app.route('/scores', methods=['POST'])
def add_score():
    data = request.json
    score_entry = {
        'player': data.get('player', 'Anonymous'),
        'score': data.get('score', 0),
        'date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    scores.append(score_entry)
    return jsonify({"message": "Score added successfully!", "score": score_entry}), 201

if __name__ == '__main__':
    app.run(debug=True)