import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";

// Used when embedding document chunks during ingestion
export const documentEmbeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001",
  apiKey: process.env.GOOGLE_API_KEY!,
  taskType: TaskType.RETRIEVAL_DOCUMENT,
});

// Used when embedding the user's search query
export const queryEmbeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001",
  apiKey: process.env.GOOGLE_API_KEY!,
  taskType: TaskType.RETRIEVAL_QUERY,
});
