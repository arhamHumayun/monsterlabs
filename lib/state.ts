import { monsterSchemaType } from "@/types/monster";
import { atom } from "recoil";

export const monsterState = atom({
  key: 'monsterState',
  default: null as monsterSchemaType | null,
});