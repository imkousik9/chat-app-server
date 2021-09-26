const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { ApolloServer } = require('apollo-server-express');

const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');

require('dotenv').config();

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const main = async () => {
  const app = express();

  const httpServer = http.createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({ req }),
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            }
          };
        }
      }
    ]
  });

  const subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: server.graphqlPath }
  );

  await server.start();
  server.applyMiddleware({ app });

  const port = process.env.PORT || 5000;

  mongoose
    .connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log('MongoDB Connected');
    })
    .catch((err) => {
      console.log(err);
    });

  httpServer.listen(port, () => {
    console.log(
      `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${port}${server.graphqlPath}`
    );
  });
};

main().catch((err) => {
  console.error(err);
});
