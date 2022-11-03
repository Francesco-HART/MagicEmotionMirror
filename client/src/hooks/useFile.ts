import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:5000/",
});
const useFile = () => {
  const convertCanavasToFileSystemAndSend = async (
    canvas: HTMLCanvasElement
  ): Promise<void> => {
    const base64Canvas = await canvas
      .toDataURL("api/image/jpeg")
      .split(";base64,")[1];
    axiosInstance
      .post("api/file", {
        base64Canvas,
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const canSendFile = async (): Promise<boolean> => {
    const res = await axiosInstance.get("api/limit");
    return res && res.data ? res.data : false;
  };
  return { convertCanavasToFileSystemAndSend, canSendFile };
};

export { useFile };
