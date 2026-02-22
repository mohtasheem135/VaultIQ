import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { CHUNK_SIZE, CHUNK_OVERLAP } from "@/constants";

export function createTextSplitter() {
  return new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,        // 1000 tokens
    chunkOverlap: CHUNK_OVERLAP,  // 200 tokens overlap — prevents context loss at boundaries
    separators: ["\n\n", "\n", ". ", "! ", "? ", " ", ""], // tries paragraph → sentence → word
  });
}
