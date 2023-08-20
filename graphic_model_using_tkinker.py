import tkinter as tk
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

# Predefined data for the bar chart
labels = ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5']
values = [30, 45, 20, 35, 50]

def on_button_click():
    plot_bar_chart()

def plot_bar_chart():
    fig, ax = plt.subplots()
    ax.bar(labels, values, color='blue')
    ax.set_ylabel('Values')
    ax.set_title('Bar Chart')
    canvas = FigureCanvasTkAgg(fig, master=chart_frame)
    canvas.draw()
    canvas.get_tk_widget().pack(side=tk.TOP, fill=tk.BOTH, expand=1)

# Create the main application window
app = tk.Tk()
app.title("Bar Chart with Predefined Data")

# Create a button widget to plot the bar chart
plot_button = tk.Button(app, text="Plot Bar Chart", command=on_button_click)
plot_button.pack(pady=10)

# Create a frame for the chart
chart_frame = tk.Frame(app)
chart_frame.pack(pady=10)

# Start the main event loop
app.mainloop()
