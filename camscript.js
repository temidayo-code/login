document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const scanModal = document.getElementById("scanModal");
  const registerModal = document.getElementById("registerModal");
  const scanButton = document.getElementById("scanButton");
  // const registerButton = document.getElementById("registerButton");
  // const captureButton = document.getElementById("captureButton");
  const scanCaptureButton = document.getElementById("scanCaptureButton");
  const closeButtons = document.querySelectorAll(".close-btn");
  const imageCountElement = document.getElementById("imageCount");
  const lastScanElement = document.getElementById("lastScan");
  const systemStatus = document.getElementById("systemStatus");

  // Store registered images
  let registeredImages = [];

  // Add this new variable for tracking scan status
  let isScanning = false;

  // Initialize system status
  function initializeSystem() {
    systemStatus.innerHTML = '<i class="fas fa-circle"></i> System Ready';
    updateImageCount();
    updateLastScan();
  }

  // Update image count
  function updateImageCount() {
    imageCountElement.textContent = registeredImages.length;
  }

  // Update last scan time
  function updateLastScan() {
    if (registeredImages.length > 0) {
      lastScanElement.textContent = new Date().toLocaleTimeString();
    }
  }

  // Initialize webcam
  function startCamera(containerId) {
    return new Promise((resolve, reject) => {
      Webcam.set({
        width: "100%",
        height: "100%",
        image_format: "jpeg",
        jpeg_quality: 90,
        flip_horiz: true,
        constraints: {
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });

      try {
        Webcam.attach(`#${containerId}`);
        showResult(
          "Camera initialized",
          "success",
          containerId === "scanCamera" ? "scanResult" : "registerResult"
        );
        resolve();
      } catch (error) {
        showResult(
          "Camera error: " + error.message,
          "error",
          containerId === "scanCamera" ? "scanResult" : "registerResult"
        );
        reject(error);
      }
    });
  }

  // Show result message
  function showResult(message, type, elementId) {
    const resultElement = document.getElementById(elementId);
    resultElement.className = `result-container ${type}`;
    resultElement.innerHTML = `
              <div class="result-message">
                  <i class="fas fa-${
                    type === "success" ? "check-circle" : "exclamation-circle"
                  }"></i>
                  ${message}
              </div>
          `;
    resultElement.style.display = "block";
  }

  // Register new image
  function registerImage() {
    Webcam.snap(function (dataUri) {
      registeredImages.push({
        image: dataUri,
        timestamp: new Date().toISOString(),
      });

      showResult("Image registered successfully!", "success", "registerResult");

      // Show preview
      const previewImage = document.createElement("img");
      previewImage.src = dataUri;
      previewImage.className = "preview-image";
      document.getElementById("registerResult").appendChild(previewImage);

      updateImageCount();

      // Close modal after delay
      setTimeout(() => {
        registerModal.style.display = "none";
        Webcam.reset();
      }, 2000);
    });
  }

  // Improved scan function
  function scanImage() {
    if (registeredImages.length === 0) {
      showResult(
        "Failed to recognize the face, try again.",
        "error",
        "scanResult"
      );
      return;
    }

    if (isScanning) {
      showResult("Scan in progress...", "info", "scanResult");
      return;
    }

    isScanning = true;
    showResult("Processing scan...", "info", "scanResult");

    Webcam.snap(function (dataUri) {
      // Create scan preview
      const scanPreview = document.createElement("div");
      scanPreview.className = "scan-preview";
      scanPreview.innerHTML = `
                  <div class="scan-result-header">
                      <h3>Scan Results</h3>
                      <span class="scan-timestamp">${new Date().toLocaleTimeString()}</span>
                  </div>
                  <div class="scan-images">
                      <div class="scan-image-container">
                          <h4>Current Scan</h4>
                          <img src="${dataUri}" class="preview-image" alt="Scanned image">
                      </div>
                      <div class="scan-image-container">
                          <h4>Last Registered Image</h4>
                          <img src="${
                            registeredImages[registeredImages.length - 1].image
                          }" class="preview-image" alt="Registered image">
                      </div>
                  </div>
                  <div class="scan-status success">
                      <i class="fas fa-check-circle"></i>
                      Scan completed successfully
                  </div>
              `;

      const resultContainer = document.getElementById("scanResult");
      resultContainer.innerHTML = ""; // Clear previous results
      resultContainer.appendChild(scanPreview);
      resultContainer.className = "result-container success";
      resultContainer.style.display = "block";

      // Update last scan time
      updateLastScan();

      // Reset scanning status
      isScanning = false;

      // Add to scan history (optional)
      addToScanHistory(dataUri);
    });
  }

  // Add this new function for scan history
  function addToScanHistory(scanImage) {
    const scanHistory = JSON.parse(localStorage.getItem("scanHistory") || "[]");
    scanHistory.push({
      timestamp: new Date().toISOString(),
      image: scanImage,
    });
    localStorage.setItem("scanHistory", JSON.stringify(scanHistory.slice(-10))); // Keep last 10 scans
  }

  // Event Listeners
  scanButton.addEventListener("click", async () => {
    scanModal.style.display = "block";
    try {
      await startCamera("scanCamera");
      // alert("Camera started successfully");
    } catch (error) {
      console.error("Camera error:", error);
    }
  });

  // registerButton.addEventListener("click", async () => {
  //   registerModal.style.display = "block";
  //   try {
  //     await startCamera("registerCamera");
  //   } catch (error) {
  //     console.error("Camera error:", error);
  //   }
  // });

  // captureButton.addEventListener("click", registerImage);

  scanCaptureButton.addEventListener("click", () => {
    // alert("Scan capture button clicked");
    if (!isScanning) {
      scanImage();
    }
  });

  // Close modal handlers
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      scanModal.style.display = "none";
      registerModal.style.display = "none";
      Webcam.reset();
    });
  });

  // Close on outside click
  window.addEventListener("click", (event) => {
    if (event.target === scanModal || event.target === registerModal) {
      scanModal.style.display = "none";
      registerModal.style.display = "none";
      Webcam.reset();
    }
  });

  // Initialize system
  initializeSystem();
});
