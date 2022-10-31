import { useRef, useState } from "react";
import * as faceapi from "@vladmandic/face-api";
import { useVideoPlayer } from "./useVideo";
import { useFile } from "./useFile";

const useFaceDetection = () => {
  const canvasRef: any = useRef(null);

  const [model, setmodel] = useState<any>();
  const { videoRef, video, accessCamera } = useVideoPlayer();
  const { convertCanavasToFileSystemAndSend, canSendFile } = useFile();

  const loadModels = () => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    ])
      .then(() => {
        faceDetection();
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const faceDetection = async () => {
    let current: any = videoRef.current;
    current as faceapi.TNetInput;
    new Promise((resolve) => {
      setInterval(async () => {
        try {
          const detections = await faceapi
            .detectAllFaces(current, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions();
          canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(current);
          faceapi.matchDimensions(canvasRef.current, {
            width: 940,
            height: 650,
          });
          const resized = faceapi.resizeResults(detections, {
            width: 940,
            height: 650,
          });
          // to draw the detection onto the detected face i.e the box
          //faceapi.draw.drawDetections(canvasRef.current, resized);
          //to draw the the points onto the detected face
          //faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);

          //to analyze and output the current expression by the detected face
          faceapi.draw.drawFaceExpressions(canvasRef.current, resized);

          const canSend = await canSendFile();
          if (canSend) {
            console.log({ canSend });

            await convertCanavasToFileSystemAndSend(canvasRef.current);
          }
          resolve({});
        } catch (err: any) {
          console.log("error mais oklm c'est catch");
          resolve();
        }
      }, 4000);
    });
  };

  return {
    faceDetection,
    loadModels,
    model,
    videoRef,
    accessCamera,
    canvasRef,
  };
};

export { useFaceDetection };
