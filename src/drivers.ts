import { type DatabaseConnection, type Driver } from "kysely";

import { type DurableObjectSqliteConfig } from "./config";
import { DurableObjectSqliteConnection } from "./connections";

export class DurableObjectSqliteDriver implements Driver {
  private _config: DurableObjectSqliteConfig;

  constructor(config: DurableObjectSqliteConfig) {
    this._config = config;
  }

  async init(): Promise<void> {}

  async acquireConnection(): Promise<DatabaseConnection> {
    return new DurableObjectSqliteConnection(this._config);
  }

  async beginTransaction(conn: DurableObjectSqliteConnection): Promise<void> {
    return await conn.beginTransaction();
  }

  async commitTransaction(conn: DurableObjectSqliteConnection): Promise<void> {
    return await conn.commitTransaction();
  }

  async rollbackTransaction(
    conn: DurableObjectSqliteConnection
  ): Promise<void> {
    return await conn.rollbackTransaction();
  }

  async releaseConnection(
    _conn: DurableObjectSqliteConnection
  ): Promise<void> {}

  async destroy(): Promise<void> {}
}
