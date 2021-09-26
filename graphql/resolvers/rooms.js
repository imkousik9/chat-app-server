const { PubSub } = require('graphql-subscriptions');
const Room = require('../../models/Room');
const Message = require('../../models/Message');

const pubsub = new PubSub();

module.exports = {
  Query: {
    async rooms() {
      try {
        const rooms = await Room.find();
        return rooms;
      } catch (err) {
        throw new Error(err);
      }
    },

    async room(_, { id }) {
      try {
        const room = await Room.findById(id);

        if (room) {
          return room;
        } else {
          throw new Error('Room not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },

  Mutation: {
    async createRoom(_, { name }) {
      const oldRoom = await Room.findOne({ name });

      if (oldRoom) {
        throw new UserInputError('Room name is taken', {
          errors: {
            room: 'This room name is taken'
          }
        });
      }

      const room = await Room.create({ name });
      pubsub.publish('NEW_ROOM', { newRoom: room });

      return {
        ...room._doc,
        id: room._id
      };
    },

    async deleteRoom(_, { id }) {
      const room = await Room.findByIdAndDelete(id);

      if (!room) {
        throw new UserInputError('Room not found', {
          errors: {
            room: 'This room not found'
          }
        });
      }

      await Message.deleteMany({ room: id });

      pubsub.publish('DELETE_ROOM', { deleteRoom: room });

      return room;
    }
  },

  Subscription: {
    newRoom: {
      subscribe: () => pubsub.asyncIterator('NEW_ROOM')
    },
    deleteRoom: {
      subscribe: () => pubsub.asyncIterator('DELETE_ROOM')
    }
  }
};
