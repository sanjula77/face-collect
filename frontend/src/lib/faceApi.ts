import * as faceapi from "face-api.js";

let modelsLoaded = false;
let modelsLoading = false;

export async function loadModels() {
  if (modelsLoaded) return;
  if (modelsLoading) {
    // Wait for the current loading to complete
    while (modelsLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return;
  }

  modelsLoading = true;
  
  try {
    const MODEL_URL = "/models"; // public/models
    console.log("Loading face-api.js models...");
    
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    ]);
    
    modelsLoaded = true;
    console.log("Face-api.js models loaded successfully!");
  } catch (error) {
    console.error("Error loading face-api.js models:", error);
    throw error;
  } finally {
    modelsLoading = false;
  }
}

export async function detectFace(video: HTMLVideoElement) {
  if (!video) return null;
  
  if (!modelsLoaded) {
    console.warn("Models not loaded yet, attempting to load...");
    await loadModels();
  }

  try {
    return await faceapi.detectSingleFace(
      video,
      new faceapi.TinyFaceDetectorOptions()
    ).withFaceLandmarks();
  } catch (error) {
    console.error("Error detecting face:", error);
    return null;
  }
}
