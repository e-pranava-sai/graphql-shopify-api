const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { createHandler } = require("graphql-http/lib/use/express");
require("dotenv").config({
  path: path.join(__dirname, ".env"),
  override: true,
});

const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");

const app = express();

app.use(bodyParser.json());

app.all(
  "/graphql",
  createHandler({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    formatError(err) {
      console.log(err);
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || "An error occured";
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    },
  })
);

app.use((err, req, res, next) => {
  console.log(err);
  const status = err.statusCode;
  const message = err.message;
  const data = err.data;
  res.status(status).json({ message: message, data: data });
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`app listening on port ${process.env.SERVER_PORT}`);
});
