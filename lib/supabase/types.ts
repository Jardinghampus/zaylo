export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      areas: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      listings: {
        Row: {
          area_id: string | null
          bedrooms: string
          created_at: string | null
          id: string
          list_for_rent: boolean | null
          list_for_sale: boolean | null
          owner_name: string
          property_type: string
          rent_price: number | null
          sale_price: number | null
          status: string | null
          sub_area_id: string | null
          title_deed_url: string | null
          vacant: boolean | null
          verified: boolean | null
          whatsapp: string
        }
        Insert: {
          area_id?: string | null
          bedrooms: string
          created_at?: string | null
          id?: string
          list_for_rent?: boolean | null
          list_for_sale?: boolean | null
          owner_name: string
          property_type: string
          rent_price?: number | null
          sale_price?: number | null
          status?: string | null
          sub_area_id?: string | null
          title_deed_url?: string | null
          vacant?: boolean | null
          verified?: boolean | null
          whatsapp: string
        }
        Update: {
          area_id?: string | null
          bedrooms?: string
          created_at?: string | null
          id?: string
          list_for_rent?: boolean | null
          list_for_sale?: boolean | null
          owner_name?: string
          property_type?: string
          rent_price?: number | null
          sale_price?: number | null
          status?: string | null
          sub_area_id?: string | null
          title_deed_url?: string | null
          vacant?: boolean | null
          verified?: boolean | null
          whatsapp?: string
        }
        Relationships: [
          {
            foreignKeyName: "listings_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_sub_area_id_fkey"
            columns: ["sub_area_id"]
            isOneToOne: false
            referencedRelation: "sub_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      request_areas: {
        Row: {
          area_id: string
          request_id: string
        }
        Insert: {
          area_id: string
          request_id: string
        }
        Update: {
          area_id?: string
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_areas_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_areas_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      requests: {
        Row: {
          bedrooms: string
          budget_max: number | null
          budget_min: number | null
          created_at: string | null
          id: string
          intent: string
          notes: string | null
          property_type: string
          requester_name: string
          status: string | null
          whatsapp: string
        }
        Insert: {
          bedrooms: string
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string | null
          id?: string
          intent: string
          notes?: string | null
          property_type: string
          requester_name: string
          status?: string | null
          whatsapp: string
        }
        Update: {
          bedrooms?: string
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string | null
          id?: string
          intent?: string
          notes?: string | null
          property_type?: string
          requester_name?: string
          status?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
      sub_areas: {
        Row: {
          area_id: string | null
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          area_id?: string | null
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          area_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_areas_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
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

export type Tables<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Row"]

export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Insert"]

export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Update"]
