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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          company_id: number
          contact_info: string | null
          name: string
          rank: number | null
        }
        Insert: {
          company_id: number
          contact_info?: string | null
          name: string
          rank?: number | null
        }
        Update: {
          company_id?: number
          contact_info?: string | null
          name?: string
          rank?: number | null
        }
        Relationships: []
      }
      compositions: {
        Row: {
          composition_id: number
          name: string
        }
        Insert: {
          composition_id: number
          name: string
        }
        Update: {
          composition_id?: number
          name?: string
        }
        Relationships: []
      }
      disease: {
        Row: {
          category: string
          description: string | null
          disease_id: string
          name: string
          symptoms: string | null
          treatment: string | null
        }
        Insert: {
          category?: string
          description?: string | null
          disease_id: string
          name: string
          symptoms?: string | null
          treatment?: string | null
        }
        Update: {
          category?: string
          description?: string | null
          disease_id?: string
          name?: string
          symptoms?: string | null
          treatment?: string | null
        }
        Relationships: []
      }
      doctors: {
        Row: {
          contact_info: string | null
          doctor_id: number
          experience_years: number | null
          hospital: string | null
          name: string
          specialization: string | null
        }
        Insert: {
          contact_info?: string | null
          doctor_id: number
          experience_years?: number | null
          hospital?: string | null
          name: string
          specialization?: string | null
        }
        Update: {
          contact_info?: string | null
          doctor_id?: number
          experience_years?: number | null
          hospital?: string | null
          name?: string
          specialization?: string | null
        }
        Relationships: []
      }
      medicine_compositions: {
        Row: {
          composition_id: number
          medicine_id: number
        }
        Insert: {
          composition_id: number
          medicine_id: number
        }
        Update: {
          composition_id?: number
          medicine_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "medicine_compositions_composition_id_fkey"
            columns: ["composition_id"]
            isOneToOne: false
            referencedRelation: "compositions"
            referencedColumns: ["composition_id"]
          },
          {
            foreignKeyName: "medicine_compositions_medicine_id_fkey"
            columns: ["medicine_id"]
            isOneToOne: false
            referencedRelation: "medicines"
            referencedColumns: ["medicine_id"]
          },
        ]
      }
      medicines: {
        Row: {
          company_id: number | null
          disease_id: string | null
          medicine_id: number
          name: string
          price: number | null
          rank: number | null
          type: string | null
        }
        Insert: {
          company_id?: number | null
          disease_id?: string | null
          medicine_id: number
          name: string
          price?: number | null
          rank?: number | null
          type?: string | null
        }
        Update: {
          company_id?: number | null
          disease_id?: string | null
          medicine_id?: number
          name?: string
          price?: number | null
          rank?: number | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medicines_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "medicines_disease_id_fkey"
            columns: ["disease_id"]
            isOneToOne: false
            referencedRelation: "disease"
            referencedColumns: ["disease_id"]
          },
        ]
      }
      pharmacies: {
        Row: {
          contact_info: string | null
          location: string | null
          name: string
          pharmacy_id: number
        }
        Insert: {
          contact_info?: string | null
          location?: string | null
          name: string
          pharmacy_id: number
        }
        Update: {
          contact_info?: string | null
          location?: string | null
          name?: string
          pharmacy_id?: number
        }
        Relationships: []
      }
      stock: {
        Row: {
          medicine_id: number | null
          pharmacy_id: number | null
          price_store: number | null
          quantity: number | null
          stock_id: number
        }
        Insert: {
          medicine_id?: number | null
          pharmacy_id?: number | null
          price_store?: number | null
          quantity?: number | null
          stock_id: number
        }
        Update: {
          medicine_id?: number | null
          pharmacy_id?: number | null
          price_store?: number | null
          quantity?: number | null
          stock_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "stock_medicine_id_fkey"
            columns: ["medicine_id"]
            isOneToOne: false
            referencedRelation: "medicines"
            referencedColumns: ["medicine_id"]
          },
          {
            foreignKeyName: "stock_pharmacy_id_fkey"
            columns: ["pharmacy_id"]
            isOneToOne: false
            referencedRelation: "pharmacies"
            referencedColumns: ["pharmacy_id"]
          },
        ]
      }
      treated_by: {
        Row: {
          disease_id: string
          doctor_id: number
        }
        Insert: {
          disease_id: string
          doctor_id: number
        }
        Update: {
          disease_id?: string
          doctor_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "treated_by_disease_id_fkey"
            columns: ["disease_id"]
            isOneToOne: false
            referencedRelation: "disease"
            referencedColumns: ["disease_id"]
          },
          {
            foreignKeyName: "treated_by_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["doctor_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
