const { PubSub } = require('graphql-subscriptions');
const Message = require('../../models/Message');
const Room = require('../../models/Room');
const User = require('../../models/User');
const checkAuth = require('../../util/auth');

const pubsub = new PubSub();

module.exports = {
  Query: {
    async messages(_, args) {
      return await Message.find({ room: args.id }).sort({ timestamp: -1 });
    }
  },

  Mutation: {
    async sendMessage(_, args, context) {
      const user = checkAuth(context);
      const message = await Message.create({
        message: args.message,
        user: user.id,
        room: args.roomId
      });

      pubsub.publish('NEW_MESSAGE', { newMessage: message });
      return message;
    }
  },

  Message: {
    async user(parent) {
      return await User.findById(parent.user);
    },

    async room(parent) {
      return await Room.findById(parent.room);
    }
  },

  Subscription: {
    newMessage: {
      subscribe: () => pubsub.asyncIterator('NEW_MESSAGE')
    }
  }
};
