document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("scanModal");
  const scanButton = document.getElementById("scanButton");
  const closeBtn = document.querySelector(".close-btn");
  const captureButton = document.getElementById("scanCaptureButton");
  const scanCamera = document.getElementById("scanCamera");

  // Create video element
  const video = document.createElement("video");
  video.setAttribute("playsinline", ""); // required for iOS
  video.setAttribute("autoplay", "");

  // Create canvas for capturing images
  const canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 240;

  let stream = null;

  // Add after creating video element
  const faceApi = document.createElement("script");
  faceApi.src = "https://cdn.jsdelivr.net/npm/face-api.js";
  document.head.appendChild(faceApi);

  let isFaceDetectorLoaded = false;

  faceApi.onload = async () => {
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri("./models");
      console.log("Face detection model loaded successfully");
      isFaceDetectorLoaded = true;
    } catch (error) {
      console.error("Error loading face detection model:", error);
    }
  };

  // Start camera
  async function startCamera() {
    try {
      // Show loading spinner while initializing
      Swal.fire({
        title: "Starting Camera",
        text: "Please wait while we initialize the camera...",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });

      // Request camera with mobile-friendly constraints
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user", // Use front camera
          width: { ideal: 320 },
          height: { ideal: 240 },
        },
        audio: false,
      });

      video.srcObject = stream;
      scanCamera.appendChild(video);

      // Wait for video to be ready
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve();
        };
      });

      // Close loading spinner
      Swal.close();

      console.log("Camera and face detection ready");
    } catch (err) {
      console.error("Camera error:", err);
      Swal.fire({
        title: "Error",
        text: "Could not access camera: " + err.message,
        icon: "error",
      });
    }
  }

  // Stop camera
  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
      stream = null;
    }
    while (scanCamera.firstChild) {
      scanCamera.removeChild(scanCamera.firstChild);
    }
  }

  // Open modal and start camera
  scanButton.addEventListener("click", function () {
    modal.style.display = "block";
    startCamera();
    document.getElementById("scanCamera").style.display = "block";
    document.getElementById("capturedImage").style.display = "none";
    captureButton.innerHTML = '<i class="fas fa-camera"></i> Take Photo';
  });

  // Close modal and stop camera
  closeBtn.addEventListener("click", function () {
    stopCamera();
    modal.style.display = "none";
  });

  // Handle photo capture
  captureButton.addEventListener("click", async function () {
    if (captureButton.innerHTML.includes("Take Photo")) {
      // Take photo
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/jpeg");

      try {
        if (!isFaceDetectorLoaded) {
          console.error("Face detector not loaded yet");
          return;
        }

        // Detect faces with adjusted parameters
        const detections = await faceapi.detectAllFaces(
          video, // Use video instead of canvas for detection
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 320,
            scoreThreshold: 0.1, // More lenient threshold for mobile
          })
        );

        console.log("Face detection result:", detections); // Debug log

        if (detections && detections.length > 0) {
          // Draw green circle for successful face detection
          const face = detections[0];
          context.strokeStyle = "#00ff00";
          context.lineWidth = 2;
          context.beginPath();
          const centerX = face.box.x + face.box.width / 2;
          const centerY = face.box.y + face.box.height / 2;
          const radius = Math.max(face.box.width, face.box.height) / 2;
          context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          context.stroke();

          // Update the image with face guide
          const imageDataWithFace = canvas.toDataURL("image/jpeg");
          document.getElementById(
            "capturedImage"
          ).innerHTML = `<img src="${imageDataWithFace}" alt="Captured photo with face guide"/>`;

          // Show processing message after 2 seconds
          setTimeout(() => {
            Swal.fire({
              title: "Please wait",
              text: "Verifying your image",
              allowOutsideClick: false,
              showConfirmButton: false,
              willOpen: () => {
                Swal.showLoading();
              },
            });

            // Show error message after 7 seconds
            setTimeout(() => {
              Swal.fire({
                title: "Facial Authentication Failed",
                html: "Please try again later or contact the helpdesk for assistance.<br><br><strong>Helpdesk Contact (Zangi): 1090611968</strong>",
                icon: "error",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
              });
            }, 7000);
          }, 2000);

          document.getElementById("scanCamera").style.display = "none";
          document.getElementById("capturedImage").style.display = "block";
          captureButton.innerHTML =
            '<i class="fas fa-camera"></i> Retake Photo';
        } else {
          // Draw red circle for no face detected
          context.strokeStyle = "#ff0000";
          context.lineWidth = 2;
          context.beginPath();
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const radius = Math.min(canvas.width, canvas.height) / 4;
          context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          context.stroke();

          // Update the image with red circle
          const imageDataNoFace = canvas.toDataURL("image/jpeg");
          document.getElementById(
            "capturedImage"
          ).innerHTML = `<img src="${imageDataNoFace}" alt="No face detected"/>`;
          document.getElementById("scanCamera").style.display = "none";
          document.getElementById("capturedImage").style.display = "block";

          // Wait 2 seconds before showing the alert
          setTimeout(() => {
            Swal.fire({
              title: "No Face Detected!",
              text: "Please try again.",
              icon: "warning",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "OK",
            }).then((result) => {
              // After alert is closed, show camera again
              document.getElementById("scanCamera").style.display = "block";
              document.getElementById("capturedImage").style.display = "none";
            });
          }, 2000);

          return;
        }
      } catch (error) {
        console.error("Face detection error:", error);
        Swal.fire({
          title: "Error",
          text: "Face detection failed. Please try again.",
          icon: "error",
        });
      }
    } else {
      // Retake photo
      document.getElementById("scanCamera").style.display = "block";
      document.getElementById("capturedImage").style.display = "none";
      captureButton.innerHTML = '<i class="fas fa-camera"></i> Take Photo';
    }
  });

  // Close modal when clicking outside
  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      stopCamera();
      modal.style.display = "none";
    }
  });
});
