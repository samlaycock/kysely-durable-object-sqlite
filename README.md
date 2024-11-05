# Kysely Migrator Local

A [Kysely](https://kysely.dev/) dialect for Cloudflare Durable Objects
[Sqlite Storage](https://developers.cloudflare.com/durable-objects/api/storage-api/#sqlexec).

## Install

`npm i kysely kysely-durable-objects-sqlite`

## Usage

```ts
import { DurableObject } from "cloudflare:workers";
import { Kysely } from "kysely";
import { DurableObjectSqliteDialect } from "kysely-durable-object-sqlite";

interface ExampleDatabase {
  users: {
    id: number;
    name: string;
  };
}

export class ExampleDurableObject extends DurableObject {
  private _db: Kysely<ExampleDatabase>;

  constructor(ctx, env) {
    super(ctx, env);

    this._db = new Kysely({
      dialect: new DurableObjectSqliteDialect({
        sql: this.ctx.storage.sql
      }),
    });

    this.ctx.blockConcurrencyWhile(async () => {
      // Do some migrations...?
    });
  }

  async getUsers() {
    const users = await this._db
      .selectFrom("users")
      .selectAll()
      .execute();

    return users;
  }
}
```
