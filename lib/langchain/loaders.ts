import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import type { Document as LangChainDocument } from "@langchain/core/documents";

type SupportedType = "pdf" | "docx" | "doc" | "txt" | "md";

// Takes a temp file path and extension, returns raw LangChain documents
export async function loadDocument(
  filePath: string,
  fileType: SupportedType
): Promise<LangChainDocument[]> {
  switch (fileType) {
    case "pdf":
      return new PDFLoader(filePath, { splitPages: true }).load();
    case "docx":
    case "doc":
      return new DocxLoader(filePath).load();
    case "txt":
    case "md":
      return new TextLoader(filePath).load();
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}
