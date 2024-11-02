import gql from "graphql-tag"; 
import { ApolloServer } from "@apollo/server"; 
import { buildSubgraphSchema } from "@apollo/subgraph"; 
import { readFileSync } from "fs"; 
import { resolvers } from "./resolvers/resolvers.js"; 

const typeDefs = gql( 
    readFileSync("./src/graphql/schema/schema.graphql", {encoding: "utf-8"}) 
); 

const graphqlServer = new ApolloServer({ 
    schema: buildSubgraphSchema([ 
        { 
            typeDefs, 
            resolvers 
        } 
    ]), 
}); 

export { graphqlServer }; 
