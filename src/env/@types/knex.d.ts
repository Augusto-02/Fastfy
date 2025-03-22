// eslint-disable-next-line
import { Knex } from "knex";

declare module "knex/type/table" {
  export interface Tables {}
}
