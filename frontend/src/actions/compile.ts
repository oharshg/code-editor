import axios from "axios";

export async function compileCode(requestData: any) {
  const endpoint = "https://api.onlinecompiler.io/api/v2/piston/execute";
  const apiKey = import.meta.env.VITE_PISTON_API_KEY;

  try {
    const response = await axios.post(endpoint, requestData, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    return error;
  }
}
