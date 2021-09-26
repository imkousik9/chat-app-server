const usersResolvers = require('./users');
const roomsResolvers = require('./rooms');
const messagesResolvers = require('./messages');

module.exports = {
  Query: {
    ...usersResolvers.Query,
    ...messagesResolvers.Query,
    ...roomsResolvers.Query
  },

  Mutation: {
    ...usersResolvers.Mutation,
    ...roomsResolvers.Mutation,
    ...messagesResolvers.Mutation
  },

  Subscription: {
    ...messagesResolvers.Subscription,
    ...roomsResolvers.Subscription
  },

  Message: {
    ...messagesResolvers.Message
  }
};
