import { knex as knexSetup } from "knex";
import config from "../knexfile";

const knex = knexSetup(config);

export default knex;
