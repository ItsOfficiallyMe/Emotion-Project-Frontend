document.addEventListener('DOMContentLoaded', () => {
    // Set Copyright Year
    document.getElementById('year').textContent = new Date().getFullYear();

    // DOM Elements - Camera
    const videoElement = document.getElementById('webcam');
    const videoOverlay = document.getElementById('videoOverlay');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const detectBtn = document.getElementById('detectBtn');
    const cameraStatus = document.getElementById('cameraStatus');
    const statusText = document.getElementById('statusText');
    const scanLine = document.getElementById('scanLine');

    // DOM Elements - Analysis
    const analysisDefault = document.getElementById('analysisDefault');
    const analysisLoader = document.getElementById('analysisLoader');
    const analysisMessage = document.getElementById('analysisMessage');
    const resultData = document.getElementById('resultData');
    
    // State variables
    let stream = null;
    let isDetecting = false;

    // Start Camera Function
    async function startCamera() {
        try {
            // Request permissions and get video stream
            stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 1280, height: 720, facingMode: "user" }, 
                audio: false 
            });
            
            // Assign stream to video element
            videoElement.srcObject = stream;
            
            // Update UI
            videoOverlay.style.opacity = '0';
            setTimeout(() => videoOverlay.style.display = 'none', 300);
            
            cameraStatus.classList.remove('status-off');
            cameraStatus.classList.add('status-on');
            statusText.textContent = 'Camera Active';
            
            startBtn.disabled = true;
            stopBtn.disabled = false;
            detectBtn.disabled = false;

        } catch (error) {
            console.error('Error accessing the webcam: ', error);
            alert('Unable to access the camera. Please ensure permissions are granted.');
        }
    }

    // Stop Camera Function
    function stopCamera() {
        if (stream) {
            // Stop all media tracks completely
            stream.getTracks().forEach(track => track.stop());
            videoElement.srcObject = null;
            stream = null;
            
            // Update UI
            videoOverlay.style.display = 'flex';
            setTimeout(() => videoOverlay.style.opacity = '1', 10);
            
            cameraStatus.classList.remove('status-on');
            cameraStatus.classList.add('status-off');
            statusText.textContent = 'Camera Off';
            
            startBtn.disabled = false;
            stopBtn.disabled = true;
            detectBtn.disabled = true;
            
            // Reset scan line if active
            if (isDetecting) resetDetectionUI();
        }
    }

    // Placeholder Function for Backend Integration
    async function detectEmotion() {
        if (!stream) return;
        
        // Prevent multiple clicks
        if (isDetecting) return;
        isDetecting = true;
        
        // Update UI to Loading State
        detectBtn.disabled = true;
        document.querySelector('.video-container').classList.add('scanning');
        
        // Hide previous results, show loader
        resultData.style.display = 'none';
        analysisDefault.style.display = 'flex';
        analysisLoader.style.display = 'inline-block';
        analysisMessage.textContent = 'Analyzing frame... Waiting for model response';

        try {
            /* * ==========================================
             * FUTURE BACKEND INTEGRATION PLACEHOLDER
             * ==========================================
             * 1. Capture frame from video element using Canvas API
             * 2. Convert to Base64 or Blob
             * 3. Send POST request to Flask/FastAPI/Node backend
             * 4. Receive JSON response containing Emotion, Confidence, and Song Metadata
             * 5. Populate the DOM elements
             * * Example:
             * const response = await fetch('/api/predict', { method: 'POST', body: imageBlob });
             * const data = await response.json();
             * updateUI(data);
             */

            // Simulation of network delay ONLY to show loading UI behavior
            // NO FAKE DATA IS GENERATED.
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Reset to waiting state since there is no real backend connected yet
            analysisLoader.style.display = 'none';
            analysisMessage.textContent = 'Backend endpoint not configured. Waiting for integration.';

        } catch (error) {
            console.error('Prediction error:', error);
            analysisLoader.style.display = 'none';
            analysisMessage.textContent = 'Error connecting to model server.';
        } finally {
            isDetecting = false;
            detectBtn.disabled = false;
            document.querySelector('.video-container').classList.remove('scanning');
        }
    }

    // Helper to reset UI when camera is stopped during detection
    function resetDetectionUI() {
        isDetecting = false;
        document.querySelector('.video-container').classList.remove('scanning');
        analysisLoader.style.display = 'none';
        analysisMessage.textContent = 'Waiting for model prediction...';
        resultData.style.display = 'none';
        analysisDefault.style.display = 'flex';
    }

    // Event Listeners
    startBtn.addEventListener('click', startCamera);
    stopBtn.addEventListener('click', stopCamera);
    detectBtn.addEventListener('click', detectEmotion);

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.7)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Smooth Scroll for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
