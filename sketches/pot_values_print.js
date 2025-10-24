import processing.serial.*;

Serial myPort;
float pot1, pot2, pot3, pot4;

void setup() {
  size(600, 400);
  background(0);
  textSize(32);
  fill(255);
  
  // Replace "COM3" (Windows) or "/dev/cu.usbserial-XXXX" (Mac) with your Arduino port
  myPort = new Serial(this, "/dev/cu.usbserial-A10N81H1", 9600);
  myPort.bufferUntil('\n');
}

void draw() {
  background(0);
  fill(255);
  text("Potentiometer Values:", 50, 60);
  
  text("Pot 1: " + int(pot1), 50, 130);
  text("Pot 2: " + int(pot2), 50, 190);
  text("Pot 3: " + int(pot3), 50, 250);
  text("Pot 4: " + int(pot4), 50, 310);
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
