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
      bands: {
        Row: {
          created_at: string
          description: string | null
          id: number
          logo_url: string | null
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          logo_url?: string | null
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          logo_url?: string | null
          name?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          created_by_uuid: string
          id: string
        }
        Insert: {
          created_at?: string
          created_by_uuid: string
          id?: string
        }
        Update: {
          created_at?: string
          created_by_uuid?: string
          id?: string
        }
        Relationships: []
      }
      members: {
        Row: {
          batch: number
          class_name: string
          dob: string
          email: string
          facebook_link: string | null
          fullname: string
          gender: number
          id: string
          main_pic: string
          phone_number: string | null
          student_code: string
          team: number
        }
        Insert: {
          batch: number
          class_name: string
          dob: string
          email: string
          facebook_link?: string | null
          fullname: string
          gender?: number
          id?: string
          main_pic: string
          phone_number?: string | null
          student_code: string
          team: number
        }
        Update: {
          batch?: number
          class_name?: string
          dob?: string
          email?: string
          facebook_link?: string | null
          fullname?: string
          gender?: number
          id?: string
          main_pic?: string
          phone_number?: string | null
          student_code?: string
          team?: number
        }
        Relationships: [
          {
            foreignKeyName: "members_team_fkey"
            columns: ["team"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["id"]
          },
        ]
      }
      members_in_band: {
        Row: {
          band_id: number | null
          id: number
          member_id: string
        }
        Insert: {
          band_id?: number | null
          id?: number
          member_id: string
        }
        Update: {
          band_id?: number | null
          id?: number
          member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "members_in_band_band_id_fkey"
            columns: ["band_id"]
            isOneToOne: false
            referencedRelation: "bands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_in_band_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      members_in_project_team: {
        Row: {
          id: number
          member_id: string
          project_team_id: number | null
        }
        Insert: {
          id?: number
          member_id: string
          project_team_id?: number | null
        }
        Update: {
          id?: number
          member_id?: string
          project_team_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "members_in_project_team_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_in_project_team_project_team_id_fkey"
            columns: ["project_team_id"]
            isOneToOne: false
            referencedRelation: "project_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string | null
          conversation_id: string
          created_at: string
          created_by_uuid: string
          id: number
          role: Database["public"]["Enums"]["messages_role"] | null
        }
        Insert: {
          content?: string | null
          conversation_id: string
          created_at?: string
          created_by_uuid: string
          id?: number
          role?: Database["public"]["Enums"]["messages_role"] | null
        }
        Update: {
          content?: string | null
          conversation_id?: string
          created_at?: string
          created_by_uuid?: string
          id?: number
          role?: Database["public"]["Enums"]["messages_role"] | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      positions: {
        Row: {
          description: string | null
          id: number
          name: string | null
        }
        Insert: {
          description?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          description?: string | null
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      positions_held: {
        Row: {
          from: string
          id: number
          is_ended: boolean | null
          member_id: string
          position_id: number | null
          to: string | null
        }
        Insert: {
          from: string
          id?: number
          is_ended?: boolean | null
          member_id: string
          position_id?: number | null
          to?: string | null
        }
        Update: {
          from?: string
          id?: number
          is_ended?: boolean | null
          member_id?: string
          position_id?: number | null
          to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "positions_held_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "positions_held_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
        ]
      }
      project_teams: {
        Row: {
          created_at: string
          description: string | null
          id: number
          logo_url: string | null
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          logo_url?: string | null
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          logo_url?: string | null
          name?: string
        }
        Relationships: []
      }
      team: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
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
      messages_role: "system" | "user" | "model"
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
