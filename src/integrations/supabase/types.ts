export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      alerts: {
        Row: {
          acknowledged: boolean | null
          created_at: string
          id: string
          message: string
          severity: string
          source_id: string
          source_type: string
          updated_at: string
        }
        Insert: {
          acknowledged?: boolean | null
          created_at?: string
          id?: string
          message: string
          severity: string
          source_id: string
          source_type: string
          updated_at?: string
        }
        Update: {
          acknowledged?: boolean | null
          created_at?: string
          id?: string
          message?: string
          severity?: string
          source_id?: string
          source_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      battery_banks: {
        Row: {
          created_at: string
          id: string
          install_date: string | null
          location: string | null
          name: string
          status: string | null
          temperature: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          install_date?: string | null
          location?: string | null
          name: string
          status?: string | null
          temperature?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          install_date?: string | null
          location?: string | null
          name?: string
          status?: string | null
          temperature?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      battery_cells: {
        Row: {
          cell_number: number
          created_at: string
          id: string
          status: string | null
          string_id: string | null
          temperature: number | null
          updated_at: string
          voltage: number | null
        }
        Insert: {
          cell_number: number
          created_at?: string
          id?: string
          status?: string | null
          string_id?: string | null
          temperature?: number | null
          updated_at?: string
          voltage?: number | null
        }
        Update: {
          cell_number?: number
          created_at?: string
          id?: string
          status?: string | null
          string_id?: string | null
          temperature?: number | null
          updated_at?: string
          voltage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "battery_cells_string_id_fkey"
            columns: ["string_id"]
            isOneToOne: false
            referencedRelation: "battery_strings"
            referencedColumns: ["id"]
          },
        ]
      }
      battery_strings: {
        Row: {
          bank_id: string | null
          created_at: string
          current: number | null
          id: string
          name: string
          status: string | null
          updated_at: string
          voltage: number | null
        }
        Insert: {
          bank_id?: string | null
          created_at?: string
          current?: number | null
          id?: string
          name: string
          status?: string | null
          updated_at?: string
          voltage?: number | null
        }
        Update: {
          bank_id?: string | null
          created_at?: string
          current?: number | null
          id?: string
          name?: string
          status?: string | null
          updated_at?: string
          voltage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "battery_strings_bank_id_fkey"
            columns: ["bank_id"]
            isOneToOne: false
            referencedRelation: "battery_banks"
            referencedColumns: ["id"]
          },
        ]
      }
      chargers: {
        Row: {
          created_at: string
          efficiency: number | null
          id: string
          input_ac_voltage: number | null
          name: string
          output_dc_current: number | null
          output_dc_voltage: number | null
          power_rating: number | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          efficiency?: number | null
          id?: string
          input_ac_voltage?: number | null
          name: string
          output_dc_current?: number | null
          output_dc_voltage?: number | null
          power_rating?: number | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          efficiency?: number | null
          id?: string
          input_ac_voltage?: number | null
          name?: string
          output_dc_current?: number | null
          output_dc_voltage?: number | null
          power_rating?: number | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      system_config: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
