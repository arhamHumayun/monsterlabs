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
      creature_images: {
        Row: {
          created_at: string
          creature_id: number
          id: number
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          creature_id: number
          id?: number
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          creature_id?: number
          id?: number
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creature_images_creature_id_fkey"
            columns: ["creature_id"]
            isOneToOne: false
            referencedRelation: "creatures"
            referencedColumns: ["id"]
          },
        ]
      }
      creatures: {
        Row: {
          alignment: string | null
          appearance: string | null
          challenge_rating: number | null
          created_at: string
          hit_dice_amount: number | null
          id: number
          is_unique: boolean | null
          json: Json | null
          lore: string | null
          main_image_url: string | null
          name: string
          pronoun: string | null
          size: string | null
          type: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          alignment?: string | null
          appearance?: string | null
          challenge_rating?: number | null
          created_at?: string
          hit_dice_amount?: number | null
          id?: number
          is_unique?: boolean | null
          json?: Json | null
          lore?: string | null
          main_image_url?: string | null
          name: string
          pronoun?: string | null
          size?: string | null
          type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          alignment?: string | null
          appearance?: string | null
          challenge_rating?: number | null
          created_at?: string
          hit_dice_amount?: number | null
          id?: number
          is_unique?: boolean | null
          json?: Json | null
          lore?: string | null
          main_image_url?: string | null
          name?: string
          pronoun?: string | null
          size?: string | null
          type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          target_id: number | null
          target_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          target_id?: number | null
          target_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          target_id?: number | null
          target_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      item_images: {
        Row: {
          created_at: string
          id: number
          item_id: number | null
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          item_id?: number | null
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          item_id?: number | null
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "item_images_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
        ]
      }
      items: {
        Row: {
          cost_amount: number | null
          created_at: string
          description: string | null
          id: number
          main_image_url: string | null
          name: string | null
          paragraphs: Json | null
          rarity: string | null
          requires_attunement: boolean | null
          requires_attunement_specific: string | null
          subtype: string | null
          type: string | null
          updated_at: string | null
          user_id: string | null
          weight: number | null
        }
        Insert: {
          cost_amount?: number | null
          created_at?: string
          description?: string | null
          id?: number
          main_image_url?: string | null
          name?: string | null
          paragraphs?: Json | null
          rarity?: string | null
          requires_attunement?: boolean | null
          requires_attunement_specific?: string | null
          subtype?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
          weight?: number | null
        }
        Update: {
          cost_amount?: number | null
          created_at?: string
          description?: string | null
          id?: number
          main_image_url?: string | null
          name?: string | null
          paragraphs?: Json | null
          rarity?: string | null
          requires_attunement?: boolean | null
          requires_attunement_specific?: string | null
          subtype?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          name: string | null
          role: string | null
          stripe_customer_id: string | null
          subscribed_to_news: boolean | null
          subscription_id: string | null
          subscription_status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          name?: string | null
          role?: string | null
          stripe_customer_id?: string | null
          subscribed_to_news?: boolean | null
          subscription_id?: string | null
          subscription_status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          name?: string | null
          role?: string | null
          stripe_customer_id?: string | null
          subscribed_to_news?: boolean | null
          subscription_id?: string | null
          subscription_status?: string | null
          updated_at?: string
          user_id?: string
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
