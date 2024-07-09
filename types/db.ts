import { creatureDataDocumentType, creatureSchemaType } from "./creature";

export interface creatureDocument {
  id: number;
  created_at: Date;
  updated_at: Date;
  user_id: string;
}

export interface creatureDataDocument extends creatureDataDocumentType {
  id: number,
  creature_id: number,
  created_at: Date,
  is_published: boolean,
};

export interface creatureData_creatureViewDocument extends creatureDataDocument, Omit<creatureDocument, 'id'> {}
export interface creature_creatureDataViewDocument extends creatureDocument {
  creatures_data: creatureDataDocument[],
}

export interface creatureView {
  id: number,
  versionId: number,
  created_at: Date,
  user_id: string,
  json: creatureSchemaType,
  is_published: boolean,
}

export interface creatureViewDataPartial extends Omit<creatureView, 'json'> {
  json: Partial<creatureSchemaType>
}