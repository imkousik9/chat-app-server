const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Message {
    id: ID
    message: String
    createdAt: String
    user: User
    room: Room
  }

  type User {
    id: ID!
    email: String!
    name: String!
    token: String!
  }

  type Room {
    id: ID
    name: String
  }

  type Query {
    user: User!
    room(id: ID): Room
    rooms: [Room]
    messages(id: ID): [Message!]
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): User!
    createRoom(name: String!): Room!
    deleteRoom(id: ID!): Room!
    sendMessage(message: String, roomId: ID): Message!
  }

  type Subscription {
    newMessage: Message
    newRoom: Room
    deleteRoom: Room
  }
`;

module.exports = typeDefs;
