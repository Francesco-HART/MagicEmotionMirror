import { useRef } from "react";

const useVideoPlayer = () => {
  const videoRef: any = useRef(null);
  let video: any;
  const accessCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };
  return { accessCamera, videoRef, video };
};

export { useVideoPlayer };
