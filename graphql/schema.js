const { buildSchema } = require("graphql");

module.exports = buildSchema(`

    type Product {
        id: String!
        title: String!
    }

    type RootQuery {
        fetchProducts(page: Int!): [Product!]!
    }

    schema {
        query: RootQuery
    }
`);
