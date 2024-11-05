import {
  DEFAULT_MIGRATION_LOCK_TABLE,
  DEFAULT_MIGRATION_TABLE,
  type DatabaseMetadataOptions,
  type Kysely,
  SqliteIntrospector,
  type TableMetadata,
} from "kysely";

import { type DurableObjectSqliteConfig } from "./config";

export class DurableObjectSqliteIntrospector extends SqliteIntrospector {
  private _config: DurableObjectSqliteConfig;

  constructor(db: Kysely<any>, config: DurableObjectSqliteConfig) {
    super(db);

    this._config = config;
  }

  async #getTableMetadata(
    name: string,
    isView: boolean
  ): Promise<TableMetadata> {
    const cursor = this._config.sql.exec(`PRAGMA table_info(${name})`);
    const rows = cursor.toArray() as {
      name: string;
      type: string;
      notnull: 1 | 0;
      dflt_value: unknown;
    }[];

    return {
      name,
      isView,
      columns: rows.map((row) => ({
        name: row.name,
        dataType: row.type,
        isAutoIncrementing: false,
        isNullable: row.notnull === 0,
        hasDefaultValue: row.dflt_value !== null,
      })),
    };
  }

  async getTables(options?: DatabaseMetadataOptions): Promise<TableMetadata[]> {
    const cursor = this._config.sql.exec("PRAGMA table_list");
    const rows = cursor.toArray() as {
      name: string;
      type: "table" | "view";
    }[];

    // We filter out tables that start with "_cf_", as they are internal tables
    // which will cause errors when trying to introspect them.
    let tables = rows.filter(({ name }) => !name.startsWith("_cf_"));

    if (!options?.withInternalKyselyTables) {
      tables = tables.filter(
        ({ name }) =>
          name !== DEFAULT_MIGRATION_TABLE &&
          name !== DEFAULT_MIGRATION_LOCK_TABLE
      );
    }

    return Promise.all(
      tables.map(({ name, type }) =>
        this.#getTableMetadata(name, type === "view")
      )
    );
  }
}
