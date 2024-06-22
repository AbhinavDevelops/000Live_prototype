import axios from "axios";
import {TranscriptionEntity} from "@/utility/types.ts";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

export async function getUpdatedTranscript(): Promise<TranscriptionEntity> {
  try {
    const response = await apiClient.get("/getTranscript");
    console.log({ updatedTranscript: response.data });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(
        `Error encountered when updating transcript: ${error.message}`,
      );
    } else {
      throw new Error("Error encountered when updating transcript.");
    }
  }
}

export async function getHello(): Promise<string> {
  try {
    const response = await apiClient.get("/hello");
    console.log({ updatedTranscript: response.data });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(
        `Error encountered when updating transcript: ${error.message}`,
      );
    } else {
      throw new Error("Error encountered when updating transcript.");
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
        `Error encountered when retrieving suggestions: ${error.message}`,
      );
    } else {
      throw new Error("Error encountered when retrieving suggestions.");
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
        `Error encountered when retrieving summary: ${error.message}`,
      );
    } else {
      throw new Error("Error encountered when retrieving summary.");
    }
  }
}

export async function terminateCall(): Promise<void> {
  try {
    console.log("Running termination.")
    const response = await apiClient.post("/terminateCall");
    console.log({ callTermResponse: response.data });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(
        `Error encountered when attempting call termination: ${error.message}`,
      );
    } else {
      throw new Error("Error encountered when attempting call termination.");
    }
  }
}
