from flask import Flask, render_template, request
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder

app = Flask(__name__)

# Load the pre-trained random forest model
data = pd.read_csv('anime.csv', escapechar='\\')
data['episodes'] = data['episodes'].replace('Unknown', 0)
X = data[['genre', 'type', 'episodes', 'members']]
y = data['rating']
mean_rating = y.mean()
y = y.fillna(mean_rating)
encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
encoder.fit(X[['genre', 'type']])
X_encoded = encoder.transform(X[['genre', 'type']])
encoded_feature_names = encoder.get_feature_names_out(['genre', 'type'])
X_encoded_df = pd.DataFrame(X_encoded, columns=encoded_feature_names)
X_final = pd.concat([X_encoded_df, X[['episodes', 'members']]], axis=1)
rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
rf_model.fit(X_final, y)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        genre = request.form['genre']
        type_ = request.form['type']
        episodes = int(request.form['episodes'])
        members = int(request.form['members'])

        # Encode the user input using the same encoder
        input_data = pd.DataFrame({
            'genre': [genre],
            'type': [type_],
            'episodes': [episodes],
            'members': [members]
        })

        input_encoded = encoder.transform(input_data[['genre', 'type']])
        input_encoded_df = pd.DataFrame(input_encoded, columns=encoded_feature_names)
        input_final = pd.concat([input_encoded_df, input_data[['episodes', 'members']]], axis=1)

        # Predict the rating for the user input
        predicted_rating = rf_model.predict(input_final)

        return render_template('result.html', predicted_rating=round(predicted_rating[0],2))

if __name__ == '__main__':
    app.run(debug=True)
