#include <ArduinoMqttClient.h>  // Include the Arduino MQTT client library

// Check the board type and include the appropriate WiFi library
#if defined(ARDUINO_SAMD_MKRWIFI1010) || defined(ARDUINO_SAMD_NANO_33_IOT) || defined(ARDUINO_AVR_UNO_WIFI_REV2)
#include <WiFiNINA.h>
#elif defined(ARDUINO_SAMD_MKR1000)
#include <WiFi101.h>
#elif defined(ARDUINO_ARCH_ESP8266)
#include <ESP8266WiFi.h>
#elif defined(ARDUINO_ARCH_ESP32)
#include <WiFi.h>
#endif

// WiFi credentials
const char* wifiSSID = "iPhone";
const char* wifiPassword = "12345666";
// Create WiFi client and MQTT client instances
WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);

// Define MQTT broker information
const char mqttBroker[] = "mqtt-dashboard.com";
int mqttPort = 1883;
const char temperatureTopic[] = "Vansh_Iot/temp";
const char heartRateTopic[] = "Vansh_Iot/heartRate";

const int lm35Pin = A0; // Analog input pin for LM35
float temperatureCelsius; // Variable to store temperature in Celsius
float temperatureFahrenheit; // Variable to store temperature in Fahrenheit
const int sensorPin = A1;
// Variables to store sensor data
int sensorValue;
int heartRate;
void setupWiFi() {
  Serial.print("Connecting to Wi-Fi...");
  WiFi.begin(wifiSSID, wifiPassword);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("Connected to Wi-Fi");
}

// Function to connect to the MQTT broker
void connectToMQTTBroker() {
  Serial.print("Attempting to connect to the MQTT broker: ");
  Serial.println(mqttBroker);

  if (!mqttClient.connect(mqttBroker, mqttPort)) {
    Serial.print("MQTT connection failed! Error code = ");
    Serial.println(mqttClient.connectError());
    while (1);
  }

  Serial.println("Connected to the MQTT broker!");
  Serial.println();
}

void setup() {
  Serial.begin(9600); // Initialize serial communication at 9600 baud
  // Set the sensor pin as an INPUT
  pinMode(sensorPin, INPUT);
  setupWiFi();          // Connect to WiFi
  connectToMQTTBroker();  // Connect to the MQTT broker
  delay(2000);
}

void loop() {
  mqttClient.poll();  // Poll the MQTT client
 delay(5000); 
  float reading=analogRead(lm35Pin);
    // Read the analog sensor value
  sensorValue = analogRead(sensorPin);
float temperature=(reading/1024.0)*5000;
float Celsius=temperature/100;
 float temperatureFahrenheit = (Celsius * 9.0 / 5.0) + 32.0;
  heartRate = map(sensorValue, 0, 1023, 50, 120);
  delay(10);
    // Publish temperature data in JSON format
  String tempData = "{\"type\":\"temp\",\"value\":" + String(temperatureFahrenheit) + "}";
  // send message, the Print interface can be used to set the message contents
    mqttClient.beginMessage(temperatureTopic);
    mqttClient.print(tempData.c_str());
    mqttClient.endMessage();

  // Publish heart rate data in JSON format
  String heartRateData = "{\"type\":\"heartRate\",\"value\":" + String(heartRate) + "}";
   mqttClient.beginMessage(heartRateTopic);
    mqttClient.print(heartRateData.c_str());
    mqttClient.endMessage();

  // Print the heart rate to the Serial Monitor
  Serial.print("Heart Rate: ");
  Serial.print(heartRate);
  Serial.println(" BPM");
  Serial.print("Temperature (F): ");
  Serial.println(temperatureFahrenheit);
}
