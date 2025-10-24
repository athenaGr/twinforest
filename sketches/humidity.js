import processing.serial.*;

Serial myPort;
float potValue; // potentiometer value

// Rain settings
int maxDrops = 1000; // maximum number of raindrops
Raindrop[] drops;

void setup() {
  size(800, 600);
  background(0);
  
  // Initialize raindrops array
  drops = new Raindrop[maxDrops];
  for (int i = 0; i < maxDrops; i++) {
    drops[i] = new Raindrop(random(width), random(-600, 0), random(2, 6));
  }
  
  // Replace with your Arduino port
  myPort = new Serial(this, "/dev/cu.usbserial-A10N81H1", 9600);
  myPort.bufferUntil('\n');
}

void draw() {
  background(0); // black background
  
  // Map potentiometer value (0-1023) to number of active raindrops
  int dropsToDraw = int(map(potValue, 0, 1023, 0, maxDrops));
  
  // Ensure we don’t exceed array bounds
  dropsToDraw = constrain(dropsToDraw, 0, maxDrops);
  
  // Draw the raindrops
  for (int i = 0; i < dropsToDraw; i++) {
    drops[i].fall();
    drops[i].show();
  }
  
  // Display current potentiometer value and number of drops
  fill(255);
  textSize(20);
  text("Pot Value: " + int(potValue), 20, 30);
  text("Raindrops: " + dropsToDraw, 20, 60);
}

// Raindrop class
class Raindrop {
  float x, y;
  float len;
  float speed;
  
  Raindrop(float x_, float y_, float len_) {
    x = x_;
    y = y_;
    len = len_;
    speed = map(len, 2, 6, 4, 10);
  }
  
  void fall() {
    y += speed;
    if (y > height) {
      y = random(-200, 0);
      x = random(width);
    }
  }
  
  void show() {
    stroke(100, 100, 255);
    // --- Adjust raindrop thickness here ---
    strokeWeight(3); // <-- change this value to make raindrops thinner or thicker
    line(x, y, x, y + len);
  }
}

// Read potentiometer value from serial
void serialEvent(Serial myPort) {
  String inString = myPort.readStringUntil('\n');
  if (inString != null) {
    inString = trim(inString);
    potValue = float(inString);
  }
}
