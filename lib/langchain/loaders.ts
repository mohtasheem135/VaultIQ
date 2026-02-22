import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import type { Document as LangChainDocument } from "@langchain/core/documents";

type SupportedType = "pdf" | "docx" | "doc" | "txt" | "md";

export async function loadDocument(
  filePath: string,
  fileType: SupportedType
): Promise<LangChainDocument[]> {
  switch (fileType) {
    case "pdf": {
      const loader = new PDFLoader(filePath, { splitPages: true });
      const docs = await loader.load();
      // Add page numbers to metadata
      docs.forEach((doc, index) => {
        doc.metadata = {
          ...doc.metadata,
          page_number: index + 1,
          total_pages: docs.length,
        };
      });
      return docs;
    }

    case "docx":
    case "doc": {
      const loader = new DocxLoader(filePath);
      const docs = await loader.load();
      docs.forEach((doc) => {
        doc.metadata = { ...doc.metadata, document_type: "docx" };
      });
      return docs;
    }

    case "txt":
    case "md": {
      const loader = new TextLoader(filePath);
      const docs = await loader.load();
      docs.forEach((doc) => {
        doc.metadata = { ...doc.metadata, document_type: "text" };
      });
      return docs;
    }

    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}
