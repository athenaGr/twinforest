import processing.serial.*;

Serial myPort;  // The serial port
float pot1, pot2, pot3, pot4;
float strokeThickness;
float strokeColor;
float posX;
float rotationDeg;

void setup() {
  size(900, 700);
  background(0);
  
  // List available ports in the console to find your Arduino
  //println(Serial.list());
  // Adjust the index [0] if needed to match your Arduino port
  myPort = new Serial(this, Serial.list()[1], 9600);
  myPort.bufferUntil('\n');
}

void draw() {
  background(0);
  
  // Map potentiometer values to desired parameters
  strokeThickness = map(pot1, 0, 1023, 5, 50);
  strokeColor = map(pot2, 0, 1023, 255, 0);  // 0=white, 1023=black
  posX = map(pot3, 0, 1023, 0, width);
  rotationDeg = map(pot4, 0, 1023, 0, 360);
  
  pushMatrix();
  translate(posX, height/2);
  rotate(radians(rotationDeg));
  
  stroke(strokeColor);
  strokeWeight(strokeThickness);
  line(-100, 0, 100, 0);
  
  popMatrix();
}

void serialEvent(Serial myPort) {
  String inString = myPort.readStringUntil('\n');
  if (inString != null) {
    inString = trim(inString);
    String[] values = split(inString, ',');
    if (values.length == 4) {
      pot1 = float(values[0]);
      pot2 = float(values[1]);
      pot3 = float(values[2]);
      pot4 = float(values[3]);
    }
  }
}
