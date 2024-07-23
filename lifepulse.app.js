// Function to initialize sensors and set up event handlers
function initSensors() {
  // Turn on the heart rate monitor
  Bangle.setHRMPower(1);

  // Set up heart rate monitor event handler
  Bangle.on('HRM', function(hrm) {
    latestHR = hrm.bpm;
    sendToCloud({
      type: 'heartRate',
      value: hrm.bpm,
      timestamp: new Date().toISOString()
    });
  });

  // Set up accelerometer event handler
  Bangle.on('accel', function(accel) {
    latestAccel = accel;
    let accelData = {
      x: accel.x,
      y: accel.y,
      z: accel.z,
      mag: accel.mag,
      timestamp: new Date().toISOString()
    };
    sendToCloud({
      type: 'accelerometer',
      value: accelData,
      timestamp: new Date().toISOString()
    });
    detectFall(accelData);
  });

  // Ensure the sensors keep working in the background
  Bangle.setOptions({powerSave: false});
}

// Function to send data to the cloud
function sendToCloud(data) {
  Bluetooth.println(JSON.stringify(data));
}

// Function to detect falls
function detectFall(accelData) {
  const FALL_THRESHOLD = 2.5; // Adjust this threshold based on testing
  if (accelData.mag > FALL_THRESHOLD) {
    sendToCloud({
      type: 'fallDetection',
      value: 'fall detected',
      timestamp: new Date().toISOString()
    });
  }
}

// Function to display the heart rate and accelerometer data
function showData() {
  g.clear();
  g.setFontAlign(0, 0); // Center alignment
  g.setFont("6x8", 2); // Set font size
  g.drawString("LifePulse", g.getWidth() / 2, 20);
  g.drawString("Press button to exit", g.getWidth() / 2, g.getHeight() - 20);

  // Dummy display for illustration purposes
  setInterval(() => {
    g.clearRect(0, 40, g.getWidth(), g.getHeight() - 40);
    g.drawString("HR: " + latestHR, g.getWidth() / 2, 60);
    g.drawString("Accel: " + latestAccel.mag.toFixed(2), g.getWidth() / 2, 100);
    g.flip();
  }, 1000);

  // Exit the app on button press
  setWatch(() => {
    Bangle.showLauncher();
  }, BTN1, { repeat: false });
}

// Variables to hold the latest data
let latestHR = 0;
let latestAccel = { x: 0, y: 0, z: 0, mag: 0 };

// Initialize sensors
initSensors();

// Create the app entry point
function onInit() {
  g.clear();
  g.setFontAlign(0, 0); // Center alignment
  g.setFont("6x8", 2); // Set font size
  g.drawString("LifePulse", g.getWidth() / 2, g.getHeight() / 2 - 20);
  g.drawString("Press button to start", g.getWidth() / 2, g.getHeight() / 2 + 20);
  g.flip();

  // Enter the app on button press
  setWatch(showData, BTN1, { repeat: false });
}

onInit();
