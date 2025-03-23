// eslint-disable-next-line
import { Knex } from "knex";

declare module "knex/types/tables" {
  export interface Tables {
    meals: {
      id: string;
      name: string;
      description: string;
      date: string;
      isDiet: boolean;
      session_id?: string;
    };
    user: {
      id: string;
      name: string;
      email: string;
      phone_number: string;
      session_id?: string;
    };
  }
}
