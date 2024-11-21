import gql from "graphql-tag";
import { dirname, resolve } from "path";
import { fileURLToPath } from 'url';
import { ApolloServer } from "@apollo/server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { readFileSync } from "fs";
import { resolvers } from "./resolvers/resolvers.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const schemaPath = resolve(__dirname, "../graphql/schema/schema.graphql");
const typeDefs = gql(readFileSync(schemaPath, { encoding: "utf-8" }));
const graphqlServer = new ApolloServer({
    schema: buildSubgraphSchema([
        {
            typeDefs,
            resolvers
        }
    ]),
});
export { graphqlServer };
