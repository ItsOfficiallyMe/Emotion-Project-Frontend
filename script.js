const video = document.getElementById("video");
const startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click", async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true
        });

        video.srcObject = stream;

    } catch (error) {
        alert("Camera access denied!");
        console.error(error);
    }
});
