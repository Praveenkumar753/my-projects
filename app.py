import os
import pandas as pd
import matplotlib.pyplot as plt
from flask import Flask, render_template, request, redirect, url_for, flash

app = Flask(__name__)
app.secret_key = "your_secret_key"  # Replace with your own secret key

# Function to visualize the data
def visualize_data(data, x_column, y_column):
    x_label = data.columns[x_column]
    y_label = data.columns[y_column]

    plt.figure(figsize=(10, 6))
    plt.bar(data[x_label], data[y_label])
    plt.xlabel(x_label)
    plt.ylabel(y_label)
    plt.title("Data Visualization")
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig("static/plot.png")  # Save the plot to a static folder
    plt.close()

# Flask route for the home page
@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        if "file" not in request.files:
            flash("No file part")
            return redirect(request.url)

        file = request.files["file"]

        if file.filename == "":
            flash("No selected file")
            return redirect(request.url)

        if file and file.filename.endswith(".csv"):
            file.save("data.csv")  # Save the uploaded CSV file
            try:
                data = pd.read_csv("data.csv")
            except pd.errors.EmptyDataError:
                flash("The CSV file is empty. Please upload a valid file.")
                return redirect(url_for("index"))

            if len(data) == 0:
                flash("The CSV file does not contain any data. Please upload a valid file.")
                return redirect(url_for("index"))

            x_column = int(request.form["x_column"])  # Get user-inputted x-column number
            y_column = int(request.form["y_column"])  # Get user-inputted y-column number

            visualize_data(data, x_column, y_column)  # Call the function to visualize the data
            flash("File uploaded and data visualized successfully!")
            return redirect(url_for("index"))

    return render_template("index.html", os=os)

if __name__ == "__main__":
    app.run(debug=True)
