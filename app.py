from flask import Flask,render_template,request
app=Flask(__name__)
@app.route("/",methods=["POST","GET"])
def calculate():
    bmi=""
    if request.method=="POST" and "weight" in request.form and "height" in request.form:
        weight=float(request.form.get("weight"))
        height=float(request.form.get("height"))
        bmi=round(weight/((height/100)**2),2)
        if float(bmi) < 18.5:
            bmi = f"You are underweight ({bmi}),so it's better to consume foods that are high in calories and protein to help them gain weight in a healthy way."
        elif 18.5 <= float(bmi) < 25:
            bmi = f"Congratulations you have a healthy weight ({bmi}).For better future keep the same diet and take diet with balanced nutritions.  "
        elif 25 <= float(bmi) < 30:
            bmi = f"You are overweight ({bmi}),so you have to take balanced diet to support weight loss, regular physical activity is important. Aim for at least 150 minutes of moderate-intensity exercise per week, or as advised by a healthcare professional."
        else:
            bmi = f"You have obesity ({bmi}),For obesity, a combination of a healthy diet, regular physical activity, and potentially medical interventions, such as weight loss medications or bariatric surgery, may be necessary. It is important to consult a healthcare professional for personalized advice and support in managing obesity."

    return render_template("index.html",bmi=bmi)
if __name__=='__main__':
    app.run(debug=True)
