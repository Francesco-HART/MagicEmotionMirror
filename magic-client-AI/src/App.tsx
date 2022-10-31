import { useEffect, useRef } from "react";
import { useFaceDetection } from "./hooks/useFaceDetecting";
import "./App.css";
import { useFile } from "./hooks/useFile";
function App() {
  const { loadModels, videoRef, accessCamera, canvasRef } = useFaceDetection();

  useEffect(() => {
    accessCamera();
    videoRef && loadModels();
  }, [videoRef, loadModels, accessCamera, canvasRef]);

  const { convertCanavasToFileSystemAndSend } = useFile();
  return (
    <div className="app">
      <button
        onClick={() => convertCanavasToFileSystemAndSend(canvasRef.current)}
      >
        Click ici ROH
      </button>

      <h1> AI FACE DETECTION</h1>
      <div className="app__video">
        <video crossOrigin="anonymous" ref={videoRef} autoPlay />
      </div>
      <canvas
        ref={canvasRef}
        width="940"
        height="650"
        className="app__canvas"
      />
    </div>
  );
}

export default App;
