const { buildSchema } = require("graphql");

module.exports = buildSchema(`

    type Product {
        id: String!
        title: String!
    }

    input Address{
        address1: String
        address2: String!
        city: String
        province: String
        country: String
        zip: String
    }

    input userInputData{
        userEmail: String!
        userCountryCode: String!
        address: Address!
        lines: [Line!]!
    }

    type TotalAmount{
        amount: String!
        currencyCode: String!
    }

    type Cost{
        totalAmount: TotalAmount!
    }

    input Line{
        quantity: Int
        merchandiseId: String
    }

    type Cart{
        id: String!
        cost: Cost!
    }

    type Query {
        fetchProducts(page: Int!): [Product!]!
    }

    type Mutation {
        createCart(input: userInputData): Cart!
    }
`);
