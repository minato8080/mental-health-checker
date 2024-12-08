import Dexie, { type EntityTable } from "dexie";

import type { Question } from "@/types/types";

/**
 * Dexieデータベースのインスタンスを作成
 */
const db = new Dexie("mental-health-checker") as Dexie & {
  question: EntityTable<
    Omit<Question, "answer">,
    "id" // 主キー
  >;
};

// スキーマの宣言
db.version(1).stores({
  question: "++id, text, weight",
});

export { db };
