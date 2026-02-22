// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import {
//   ArrowLeft,
//   Download,
//   FileText,
//   Loader2,
//   AlertTriangle,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { cn } from "@/lib/utils/cn";

// type ViewData = {
//   url: string;
//   file_name: string;
//   file_type: string;
// };

// const TEXT_TYPES = ["txt", "md"];
// const PDF_TYPES  = ["pdf"];

// export default function DocumentViewerPage() {
//   const { id } = useParams<{ id: string }>();
//   const router  = useRouter();

//   const [viewData, setViewData]   = useState<ViewData | null>(null);
//   const [textContent, setTextContent] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError]         = useState<string | null>(null);

//   useEffect(() => {
//     async function load() {
//       try {
//         setIsLoading(true);
//         const res  = await fetch(`/api/documents/${id}/view`);
//         const json = await res.json();

//         if (json.error) throw new Error(json.error);

//         const data: ViewData = json.data;
//         setViewData(data);

//         // For text files, fetch the content directly
//         if (TEXT_TYPES.includes(data.file_type)) {
//           const textRes = await fetch(data.url);
//           const text    = await textRes.text();
//           setTextContent(text);
//         }
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Failed to load document");
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     load();
//   }, [id]);

//   const handleDownload = () => {
//     if (!viewData) return;
//     const a  = document.createElement("a");
//     a.href   = viewData.url;
//     a.download = viewData.file_name;
//     a.click();
//   };

//   return (
//     <div className="flex flex-col h-screen bg-background">
//       {/* ── Toolbar ─────────────────────────────────────────────────────── */}
//       <div className="flex items-center gap-3 px-4 py-3 border-b bg-background shrink-0">
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={() => router.back()}
//           aria-label="Go back"
//           className="h-8 w-8"
//         >
//           <ArrowLeft className="h-4 w-4" />
//         </Button>

//         <div className="flex items-center gap-2 flex-1 min-w-0">
//           <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
//           <span className="text-sm font-medium truncate">
//             {isLoading ? (
//               <Skeleton className="h-4 w-48" />
//             ) : (
//               viewData?.file_name ?? "Document"
//             )}
//           </span>
//         </div>

//         <Button
//           variant="outline"
//           size="sm"
//           onClick={handleDownload}
//           disabled={isLoading || !!error}
//           className="shrink-0"
//         >
//           <Download className="h-3.5 w-3.5 mr-2" />
//           Download
//         </Button>
//       </div>

//       {/* ── Content ─────────────────────────────────────────────────────── */}
//       <div className="flex-1 overflow-hidden">
//         {isLoading && <DocumentViewerSkeleton />}

//         {error && !isLoading && (
//           <div className="flex flex-col items-center justify-center h-full text-center px-4">
//             <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-3">
//               <AlertTriangle className="h-6 w-6 text-destructive" />
//             </div>
//             <p className="text-sm font-medium text-foreground">
//               Failed to load document
//             </p>
//             <p className="text-xs text-muted-foreground mt-1">{error}</p>
//             <Button
//               variant="outline"
//               size="sm"
//               className="mt-4"
//               onClick={() => router.back()}
//             >
//               Go back
//             </Button>
//           </div>
//         )}

//         {/* PDF Viewer */}
//         {!isLoading && !error && viewData && PDF_TYPES.includes(viewData.file_type) && (
//           <iframe
//             src={`${viewData.url}#toolbar=1&navpanes=1`}
//             className="w-full h-full border-0"
//             title={viewData.file_name}
//           />
//         )}

//         {/* DOCX — no browser renderer, show download prompt */}
//         {!isLoading && !error && viewData &&
//           viewData.file_type === "docx" || viewData?.file_type === "doc" ? (
//           <div className="flex flex-col items-center justify-center h-full text-center px-4">
//             <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center mb-4">
//               <FileText className="h-7 w-7 text-muted-foreground" />
//             </div>
//             <p className="text-sm font-semibold text-foreground mb-1">
//               {viewData?.file_name}
//             </p>
//             <p className="text-xs text-muted-foreground mb-5 max-w-xs">
//               DOCX files cannot be previewed in the browser. Download to view in
//               Microsoft Word or Google Docs.
//             </p>
//             <Button
//               onClick={handleDownload}
//               className="bg-indigo-500 hover:bg-indigo-600"
//             >
//               <Download className="h-4 w-4 mr-2" />
//               Download Document
//             </Button>
//           </div>
//         ) : null}

//         {/* Plain Text / Markdown Viewer */}
//         {!isLoading && !error && viewData && TEXT_TYPES.includes(viewData.file_type) && (
//           <div className="h-full overflow-y-auto">
//             <pre
//               className={cn(
//                 "p-6 text-sm text-foreground font-mono leading-relaxed",
//                 "whitespace-pre-wrap break-words max-w-4xl mx-auto"
//               )}
//             >
//               {textContent ?? ""}
//             </pre>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function DocumentViewerSkeleton() {
//   return (
//     <div className="flex items-center justify-center h-full">
//       <div className="flex flex-col items-center gap-3">
//         <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
//         <p className="text-sm text-muted-foreground">Loading document...</p>
//       </div>
//     </div>
//   );
// }








"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  FileText,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/cn";

type ViewData = {
  url: string;
  file_name: string;
  file_type: string;
};

const TEXT_TYPES = ["txt", "md"];

export default function DocumentViewerPage() {
  const { id }   = useParams<{ id: string }>();
  const router   = useRouter();

  const [viewData, setViewData]       = useState<ViewData | null>(null);
  const [blobUrl, setBlobUrl]         = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [isLoading, setIsLoading]     = useState(true);
  const [error, setError]             = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);

        // Step 1 — get signed URL from our API
        const res  = await fetch(`/api/documents/${id}/view`);
        const json = await res.json();
        if (json.error) throw new Error(json.error);

        const data: ViewData = json.data;
        setViewData(data);

        if (TEXT_TYPES.includes(data.file_type)) {
          // Text files — fetch content directly
          const textRes = await fetch(data.url);
          const text    = await textRes.text();
          setTextContent(text);
        } else {
          // PDF/DOCX — fetch as blob and create a local blob URL
          // This bypasses CSP iframe restrictions on external URLs
          const fileRes  = await fetch(data.url);
          const blob     = await fileRes.blob();
          const localUrl = URL.createObjectURL(blob);
          setBlobUrl(localUrl);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load document");
      } finally {
        setIsLoading(false);
      }
    }

    load();

    // Cleanup blob URL on unmount to avoid memory leaks
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [id]);

  const handleDownload = () => {
    if (!blobUrl || !viewData) return;
    const a    = document.createElement("a");
    a.href     = blobUrl;
    a.download = viewData.file_name;
    a.click();
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* ── Toolbar ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-background shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          aria-label="Go back"
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-sm font-medium truncate">
            {isLoading ? (
              <Skeleton className="h-4 w-48 inline-block" />
            ) : (
              viewData?.file_name ?? "Document"
            )}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          disabled={isLoading || !!error || !blobUrl}
          className="shrink-0"
        >
          <Download className="h-3.5 w-3.5 mr-2" />
          Download
        </Button>
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
              <p className="text-sm text-muted-foreground">Loading document...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-3">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <p className="text-sm font-medium">Failed to load document</p>
            <p className="text-xs text-muted-foreground mt-1">{error}</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => router.back()}>
              Go back
            </Button>
          </div>
        )}

        {/* PDF — rendered from blob URL, no CSP issues */}
        {!isLoading && !error && blobUrl && viewData?.file_type === "pdf" && (
          <iframe
            src={blobUrl}
            className="w-full h-full border-0"
            title={viewData.file_name}
          />
        )}

        {/* DOCX — no browser renderer */}
        {!isLoading && !error && viewData &&
          ["docx", "doc"].includes(viewData.file_type) && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center mb-4">
              <FileText className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-sm font-semibold mb-1">{viewData.file_name}</p>
            <p className="text-xs text-muted-foreground mb-5 max-w-xs">
              DOCX files cannot be previewed in the browser. Download to view
              in Microsoft Word or Google Docs.
            </p>
            <Button
              onClick={handleDownload}
              className="bg-indigo-500 hover:bg-indigo-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Document
            </Button>
          </div>
        )}

        {/* Plain Text / Markdown */}
        {!isLoading && !error && viewData && TEXT_TYPES.includes(viewData.file_type) && (
          <div className="h-full overflow-y-auto">
            <pre className={cn(
              "p-6 text-sm text-foreground font-mono leading-relaxed",
              "whitespace-pre-wrap break-words max-w-4xl mx-auto"
            )}>
              {textContent ?? ""}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
