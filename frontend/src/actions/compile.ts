import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function compileCode(requestData: any) {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/compile`,
      requestData
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    return error;
  }
}
