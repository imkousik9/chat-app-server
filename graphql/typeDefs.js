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
    user: User
  }

  type FieldError {
    field: String
    message: String
  }

  type UserResponse {
    errors: [FieldError]
    user: User
  }

  type Query {
    user: User
    room(id: ID): Room
    rooms: [Room]
    messages(id: ID): [Message!]
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): UserResponse
    login(email: String!, password: String!): UserResponse
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
