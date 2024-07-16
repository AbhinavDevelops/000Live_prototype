import axios from "axios";
import { TranscriptionEntity } from "@/utility/types.ts";
import Groq from "groq-sdk";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
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
    const response = await axios.get("http://localhost:8080/api/hello");
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
export async function getUsers(): Promise<string> {
  try {
    const response = await axios.get("http://localhost:8080/api/users");
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
export async function getSummary(fullTranscript: string): Promise<string> {
  try {
    console.log("USING TRANSCRIPT BELOW");
    console.log(fullTranscript);
    const groqKey = import.meta.env.VITE_GROQ_KEY;
    const groq = new Groq({ apiKey: groqKey, dangerouslyAllowBrowser: true });
    const groqResponse = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are receiving a conversation between a caller and an emergency services first-responder. Respond with key points of crucial information about the caller, identity, situation and the department required (i.e. 'Department: [Fire/Police/Ambulance]') as a continuous string of text, with each key piece of info separated by a period (eg. 'Caller is bleeding out.Caller is trapped in lift with daughter.Felon holding both people hostage.'). Each key point should have only one piece of information. The department point should come first in your response. Return to me nothing else.",
        },
        {
          role: "user",
          content:
            // "Do not add 'here are the key dot points'. I am sending you a transcript of a live audio call return to me the key dot points as string separated by periods. Here is the transcript: 'I need help urgently. I am stuck in an elevator at the Hilton Hotel, New York. I have been here for over 3 hours and am feeling claustrophobic and very scared. My phone battery is low, and I can't call anyone.'",
            `Here is the transcript - if you do not see any script after the end of this sentence, say "Awaiting key information." : ${fullTranscript}`,
        },
      ],
      model: "llama3-70b-8192",
    });

    console.log({ callSummary: groqResponse.choices[0].message.content! });
    return groqResponse.choices[0].message.content!;
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
    console.log("Running termination.");
    const response = await axios.post(
      "http://localhost:8080/api/terminateCall",
    );
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

export async function restartCall(): Promise<void> {
  try {
    console.log("Running termination.");
    const response = await axios.post("http://localhost:8080/api/restartCall");
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
