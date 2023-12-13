const videoSize = {
    width: 1280,
    height: 720
  };
  
  const video = document.querySelector("video");
  
  video.addEventListener("play", () => {
    // Creo un overlay
    const facesOverlay = faceapi.createCanvasFromMedia(video);
    document.body.appendChild(facesOverlay);
    facesOverlay.style = "z-index: 1; position: absolute; margin-top: 2rem; border-radius: 1rem;";
    faceapi.matchDimensions(facesOverlay, videoSize);
    setInterval(async () => {
      const faceDetected = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 256 }));
      const resizesFaces = faceapi.resizeResults(faceDetected, videoSize);
      facesOverlay.getContext("2d").clearRect(0, 0, facesOverlay.width, facesOverlay.height);
      faceapi.draw.drawDetections(facesOverlay, resizesFaces);
    }, 100);
  });
  
  const app = () => {
    console.log("in app()");
    const videoOptions = {
      audio: false,
      video: videoSize
    };
  
    navigator.mediaDevices.getUserMedia(videoOptions)
      .then(mediaStream => {
        video.srcObject = mediaStream;
        video.onloadeddata = () => {
          video.play();
        };
      });
  };
  
  Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("http://localhost:8080/dist/weights"),
    faceapi.nets.faceLandmark68Net.loadFromUri("http://localhost:8080/dist/weights"),
    faceapi.nets.faceRecognitionNet.loadFromUri("http://localhost:8080/dist/weights")
  ]).then(app).catch(error => {
    console.error("Error loading models:", error);
  });
  