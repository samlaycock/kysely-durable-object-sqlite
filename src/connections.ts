import {
  type DatabaseConnection,
  type CompiledQuery,
  type QueryResult,
} from "kysely";

import { type DurableObjectSqliteConfig } from "./config";

export class DurableObjectSqliteConnection implements DatabaseConnection {
  private _config: DurableObjectSqliteConfig;

  constructor(config: DurableObjectSqliteConfig) {
    this._config = config;
  }

  async executeQuery<O>(compiledQuery: CompiledQuery): Promise<QueryResult<O>> {
    const cursor = this._config.sql.exec(
      compiledQuery.sql,
      ...compiledQuery.parameters
    );
    const numAffectedRows = BigInt(cursor.rowsWritten);

    return {
      insertId: undefined,
      rows: cursor.toArray() as O[],
      numAffectedRows,
      numUpdatedOrDeletedRows: numAffectedRows,
    };
  }

  async beginTransaction() {
    throw new Error("Transactions are not supported yet.");
  }

  async commitTransaction() {
    throw new Error("Transactions are not supported yet.");
  }

  async rollbackTransaction() {
    throw new Error("Transactions are not supported yet.");
  }

  async *streamQuery<O>(
    _compiledQuery: CompiledQuery,
    _chunkSize: number
  ): AsyncIterableIterator<QueryResult<O>> {
    throw new Error("Streaming queries are not supported yet.");
  }
}
