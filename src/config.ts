import { type SqlStorage } from "@cloudflare/workers-types";

export interface DurableObjectSqliteConfig {
  sql: SqlStorage;
}
