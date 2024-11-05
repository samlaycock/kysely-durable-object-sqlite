import {
  type DatabaseIntrospector,
  type Dialect,
  type Driver,
  Kysely,
  type QueryCompiler,
  SqliteAdapter,
  SqliteQueryCompiler,
} from "kysely";

import { type DurableObjectSqliteConfig } from "./config";
import { DurableObjectSqliteDriver } from "./drivers";
import { DurableObjectSqliteIntrospector } from "./introspectors";

export class DurableObjectSqliteDialect implements Dialect {
  private _config: DurableObjectSqliteConfig;

  constructor(config: DurableObjectSqliteConfig) {
    this._config = config;
  }

  createAdapter() {
    return new SqliteAdapter();
  }

  createDriver(): Driver {
    return new DurableObjectSqliteDriver(this._config);
  }

  createQueryCompiler(): QueryCompiler {
    return new SqliteQueryCompiler();
  }

  createIntrospector(db: Kysely<any>): DatabaseIntrospector {
    return new DurableObjectSqliteIntrospector(db, this._config);
  }
}
