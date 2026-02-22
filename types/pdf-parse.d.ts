declare module "pdf-parse" {
    interface PDFParseResult {
      text: string;
      numpages: number;
      numrender: number;
      info: Record<string, unknown>;
      metadata: Record<string, unknown>;
      version: string;
    }
  
    // ✅ v2 exports as named default inside the module
    const pdfParse: (
      dataBuffer: Buffer,
      options?: Record<string, unknown>
    ) => Promise<PDFParseResult>;
  
    export default pdfParse;
  }
  