import { creatureSchemaType } from "./creature";

export interface creatureDocument {
  id: number;
  created_at: Date;
  updated_at: Date;
  user_id: string;
  json: creatureSchemaType;
  is_public: boolean;
}