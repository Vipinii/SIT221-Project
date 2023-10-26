import tkinter as tk
from tkinter import ttk
import time
import paho.mqtt.client as mqtt
import json

# MQTT Broker information
mqtt_broker = "mqtt-dashboard.com"  # Replace with your MQTT broker address
mqtt_port = 1883  # MQTT port (default is 1883)
mqtt_topic_temperature = "Vansh_Iot/temp"  # MQTT topic for temperature data
mqtt_topic_heart_rate = "Vansh_Iot/heartRate"  # MQTT topic for heart rate data

def on_emergency_button_click():
    print("Emergency Button Pressed")
    
    # Send emergency data as a JSON object
    data = {"type": "emergency", "value": 'true'}
    mqtt_client.publish("emergency", json.dumps(data))
def off_emergency_button_click():
    print("Emergency Button Pressed")
    
    # Send emergency data as a JSON object
    data = {"type": "emergency", "value": 'false'}
    mqtt_client.publish("emergency", json.dumps(data))
    

def on_message(client, userdata, message):
    if message.topic == mqtt_topic_temperature:
        try:
            data = json.loads(message.payload)
            temperature = data.get("value", 0.0)
            temperature_label.config(text="Temperature: {:.1f}°C".format(temperature))
        except json.JSONDecodeError as e:
            print("Error decoding JSON for temperature:", e)
    elif message.topic == mqtt_topic_heart_rate:
        try:
            data = json.loads(message.payload)
            heart_rate = data.get("value", 0)
            heart_rate_label.config(text="Heart Rate: {} bpm".format(heart_rate))
        except json.JSONDecodeError as e:
            print("Error decoding JSON for heart rate:", e)

def update_data():
    # Update time
    current_time = time.strftime("%H:%M:%S")
    time_label.config(text="Current Time: " + current_time)
    # Schedule the update_data function to run every 1000 milliseconds (1 second)
    root.after(1000, update_data)

root = tk.Tk()
root.title("Raspberry Pi Monitoring GUI")
root.geometry("400x300")  # Set the window size

# MQTT client setup
mqtt_client = mqtt.Client()
mqtt_client.on_message = on_message
mqtt_client.connect(mqtt_broker, mqtt_port, 60)
mqtt_client.subscribe([(mqtt_topic_temperature, 0), (mqtt_topic_heart_rate, 0)])
mqtt_client.loop_start()

# Create a frame to group the widgets
frame = ttk.Frame(root)
frame.pack(padx=20, pady=20, fill=tk.BOTH, expand=True)

# Create a style for labels
style = ttk.Style()
style.configure("LabelStyle.TLabel", font=("Helvetica", 14), foreground="#333")

# Emergency Button with a red color
style.configure("TButton", foreground="white", background="#FF5733")
emergency_button = ttk.Button(frame, text="Emergency", command=on_emergency_button_click, style="TButton")
emergency_button.grid(row=0, column=0, pady=10)

style.configure("TButton", foreground="white", background="#FF5733")
emergency_button = ttk.Button(frame, text="Emergency_OFF", command=off_emergency_button_click, style="TButton")
emergency_button.grid(row=0, column=5, pady=10)

# Current Time Label
time_label = ttk.Label(frame, text="Current Time: ", style="LabelStyle.TLabel")
time_label.grid(row=1, column=0, pady=5)

# Temperature Label
temperature_label = ttk.Label(frame, text="Temperature: ", style="LabelStyle.TLabel")
temperature_label.grid(row=2, column=0, pady=5)

# Heart Rate Label
heart_rate_label = ttk.Label(frame, text="Heart Rate: ", style="LabelStyle.TLabel")
heart_rate_label.grid(row=3, column=0, pady=5)

# Start updating data
update_data()

root.mainloop()