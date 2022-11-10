import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://192.168.43.62:5000/api",
});
const useFile = () => {
  const convertCanavasToFileSystemAndSend = async (
    canvas: HTMLCanvasElement
  ): Promise<void> => {
    const base64Canvas = await canvas
      .toDataURL("image/jpeg")
      .split(";base64,")[1];
    axiosInstance
      .post("/file", {
        base64Canvas,
      })
      .catch(function (error: any) {
        console.log(error);
      });
  };

  const canSendFile = async (): Promise<boolean> => {
    const res = await axiosInstance.get("/limit");
    return res && res.data ? res.data : false;
  };
  return { convertCanavasToFileSystemAndSend, canSendFile };
};

export { useFile };
