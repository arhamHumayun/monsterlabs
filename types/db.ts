import { z } from "zod";
import { creatureJsonBlobDocumentSchema } from "./creature";

export type creaturesDocument = {
  id: number,  // Document Id
  user_id: string,  // User Id
  created_at: Date,
  updated_at: Date,

  // Actual creature data
  name: string,
  lore: string,
  appearance: string,
  pronoun: string,
  type: string,
  is_unique: boolean,
  challenge_rating: number,
  alignment: string,
  size: string,
  json: z.infer<typeof creatureJsonBlobDocumentSchema>
}
