export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      document_chunks: {
        Row: {
          category_id: string | null
          content: string
          created_at: string
          document_id: string
          embedding: string
          id: number
          metadata: Json
          user_id: string
        }
        Insert: {
          category_id?: string | null
          content: string
          created_at?: string
          document_id: string
          embedding: string
          id?: number
          metadata?: Json
          user_id: string
        }
        Update: {
          category_id?: string | null
          content?: string
          created_at?: string
          document_id?: string
          embedding?: string
          id?: number
          metadata?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_chunks_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_chunks_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category_id: string | null
          chunk_count: number
          created_at: string
          error_message: string | null
          file_name: string
          file_size: number
          file_type: string
          id: string
          status: Database["public"]["Enums"]["document_status"]
          storage_path: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category_id?: string | null
          chunk_count?: number
          created_at?: string
          error_message?: string | null
          file_name: string
          file_size: number
          file_type: string
          id?: string
          status?: Database["public"]["Enums"]["document_status"]
          storage_path: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category_id?: string | null
          chunk_count?: number
          created_at?: string
          error_message?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          status?: Database["public"]["Enums"]["document_status"]
          storage_path?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_documents: {
        Args: {
          filter_category_id?: string
          filter_user_id: string
          match_count: number
          match_threshold: number
          query_embedding: string
        }
        Returns: {
          content: string
          document_id: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
    }
    Enums: {
      document_status: "processing" | "ready" | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      document_status: ["processing", "ready", "failed"],
    },
  },
} as const


// ─────────────────────────────────────────────────────────────────────────────
// Convenience exports — derived from the generated Database type above
// Usage: import type { Category, Document, DocumentChunk } from "@/types/database.types"
// ─────────────────────────────────────────────────────────────────────────────

export type Category     = Database["public"]["Tables"]["categories"]["Row"];
export type Document     = Database["public"]["Tables"]["documents"]["Row"];
export type DocumentChunk = Database["public"]["Tables"]["document_chunks"]["Row"];

// Insert / Update helpers (useful in API routes and mutations)
export type CategoryInsert     = Database["public"]["Tables"]["categories"]["Insert"];
export type CategoryUpdate     = Database["public"]["Tables"]["categories"]["Update"];
export type DocumentInsert     = Database["public"]["Tables"]["documents"]["Insert"];
export type DocumentUpdate     = Database["public"]["Tables"]["documents"]["Update"];
export type DocumentChunkInsert = Database["public"]["Tables"]["document_chunks"]["Insert"];

// Enum type
export type DocumentStatus = Database["public"]["Enums"]["document_status"];

// RPC return type for match_documents
export type MatchDocumentsResult =
  Database["public"]["Functions"]["match_documents"]["Returns"][number];

// Chunk metadata shape stored in the JSONB column
export type ChunkMetadata = {
  file_name: string;
  chunk_index: number;
  page_number?: number;
};

// Document row with joined category (used in UI)
export type DocumentWithCategory = Document & {
  category: Category | null;
};
