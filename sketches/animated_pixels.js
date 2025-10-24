import processing.serial.*;

// Serial and potentiometer variables
Serial myPort;
float pot1, pot2, pot3, pot4;

// Pixel settings
int pixelSize = 10;               // size of each “pixel”
boolean[][] pixelSet;             // tracks which pixels are active
color[][] pixelColors;            // stores pixel color

int cols, rows;                   // number of columns and rows

void setup() {
  size(900, 700);
  background(0);
  textSize(18);
  fill(255);
  
  cols = width / pixelSize;
  rows = height / pixelSize;
  
  pixelSet = new boolean[cols][rows];
  pixelColors = new color[cols][rows];
  
  // Replace with your Arduino port
  myPort = new Serial(this, "/dev/cu.usbserial-A10N81H1", 9600);
  myPort.bufferUntil('\n');
}

void draw() {
  background(0);
  
  // Count how many pots are in low range (0–200)
  int lowCount = 0;
  if (pot1 <= 200) lowCount++;
  if (pot2 <= 200) lowCount++;
  if (pot3 <= 200) lowCount++;
  if (pot4 <= 200) lowCount++;
  
  // Determine fraction of canvas to fill based on lowCount
  float targetFraction = 0; 
  if (lowCount == 4) targetFraction = 1.0;   // full canvas
  else if (lowCount == 3) targetFraction = 0.5; // half canvas
  else if (pot1 > 200 && pot1 <= 650 &&
           pot2 > 200 && pot2 <= 650 &&
           pot3 > 200 && pot3 <= 650 &&
           pot4 > 200 && pot4 <= 650) targetFraction = 0.1; // 1/10
  else targetFraction = 0.0; // high range → no pixels
  
  // Gradually add pixels until the fraction is reached
  addPixels(targetFraction);
  
  // Draw pixels
  for (int i = 0; i < cols; i++) {
    for (int j = 0; j < rows; j++) {
      if (pixelSet[i][j]) {
        fill(pixelColors[i][j]);
        noStroke();
        rect(i * pixelSize, j * pixelSize, pixelSize, pixelSize);
      }
    }
  }
  
  // Display pot values for reference
  fill(255);
  text("Pot1: " + int(pot1), 20, 30);
  text("Pot2: " + int(pot2), 20, 60);
  text("Pot3: " + int(pot3), 20, 90);
  text("Pot4: " + int(pot4), 20, 120);
}

// --- Add pixels gradually, respecting target fraction ---
void addPixels(float fraction) {
  int totalBlocks = cols * rows;
  int targetBlocks = int(totalBlocks * fraction);
  
  // Count currently active pixels
  int currentBlocks = 0;
  for (int i = 0; i < cols; i++)
    for (int j = 0; j < rows; j++)
      if (pixelSet[i][j]) currentBlocks++;
  
  // Gradually add new pixels if we haven't reached target fraction
  int pixelsToAdd = int((targetBlocks - currentBlocks) * 0.02); // 2% per frame
  pixelsToAdd = max(pixelsToAdd, 0); // don't add if negative
  
  for (int k = 0; k < pixelsToAdd; k++) {
    int i = int(random(cols));
    int j = int(random(rows));
    if (!pixelSet[i][j]) {
      pixelSet[i][j] = true;
      pixelColors[i][j] = color(int(random(100, 255)), 0, 0); // random red shade
    }
  }
  
  // If target fraction is lower than current, remove pixels randomly
  int pixelsToRemove = currentBlocks - targetBlocks;
  pixelsToRemove = max(pixelsToRemove, 0);
  for (int k = 0; k < pixelsToRemove; k++) {
    int i = int(random(cols));
    int j = int(random(rows));
    if (pixelSet[i][j]) {
      pixelSet[i][j] = false;
    }
  }
}

// --- Read serial data from Arduino ---
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
