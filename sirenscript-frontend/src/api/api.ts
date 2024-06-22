import axios from "axios";

const apiClient = axios.create({
  baseURL: "localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

export async function getUpdatedTranscript(): Promise<string> {
  try {
    const response = await apiClient.get("/getTranscript");
    console.log({ updatedTranscript: response.data });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(
        `Error encountered when attempting expense creation: ${error.message}`,
      );
    } else {
      throw new Error("Error encountered when attempting expense creation.");
    }
  }
}

export async function getSuggestions(): Promise<string> {
  try {
    const response = await apiClient.get("/getSuggestions");
    console.log({ callSuggestions: response.data });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(
        `Error encountered when attempting expense creation: ${error.message}`,
      );
    } else {
      throw new Error("Error encountered when attempting expense creation.");
    }
  }
}
export async function getSummary(): Promise<string> {
  try {
    const response = await apiClient.get("/getSummary");
    console.log({ callSummary: response.data });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(
        `Error encountered when attempting expense creation: ${error.message}`,
      );
    } else {
      throw new Error("Error encountered when attempting expense creation.");
    }
  }
}

export async function terminateCall(): Promise<void> {
  try {
    const response = await apiClient.post("/terminateCall");
    console.log({ callTermResponse: response.data });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(
        `Error encountered when attempting expense creation: ${error.message}`,
      );
    } else {
      throw new Error("Error encountered when attempting expense creation.");
    }
  }
}
