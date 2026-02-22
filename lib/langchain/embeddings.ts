// import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
// import { TaskType } from "@google/generative-ai";

// // Used when embedding document chunks during ingestion
// export const documentEmbeddings = new GoogleGenerativeAIEmbeddings({
//   model: "gemini-embedding-001",
//   apiKey: process.env.GOOGLE_API_KEY!,
//   taskType: TaskType.RETRIEVAL_DOCUMENT,
// });

// // Used when embedding the user's search query
// export const queryEmbeddings = new GoogleGenerativeAIEmbeddings({
//   model: "gemini-embedding-001",
//   apiKey: process.env.GOOGLE_API_KEY!,
//   taskType: TaskType.RETRIEVAL_QUERY,
// });



import { GoogleGenAI } from "@google/genai";
import type { EmbeddingsInterface } from "@langchain/core/embeddings";

const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });

class GeminiEmbeddings implements EmbeddingsInterface {
  constructor(private taskType: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY") {}

  async embedDocuments(texts: string[]): Promise<number[][]> {
    // Process in parallel but respect rate limits
    const results = await Promise.all(texts.map((t) => this.embed(t)));
    return results;
  }

  async embedQuery(text: string): Promise<number[]> {
    return this.embed(text);
  }

  private async embed(text: string): Promise<number[]> {
    const response = await genAI.models.embedContent({
      model: "gemini-embedding-001",
      contents: text,
      config: {
        taskType: this.taskType,
        outputDimensionality: 768,    // ✅ native 768 — no truncation
      },
    });

    const values = response.embeddings?.[0]?.values;
    if (!values) throw new Error("Gemini returned no embedding values");

    return values;
  }
}

// Used when embedding document chunks during ingestion
export const documentEmbeddings = new GeminiEmbeddings("RETRIEVAL_DOCUMENT");

// Used when embedding the user's search query
export const queryEmbeddings = new GeminiEmbeddings("RETRIEVAL_QUERY");
