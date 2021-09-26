const { UserInputError } = require('apollo-server-express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const checkAuth = require('../../util/auth');

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name
    },
    process.env.SECRET_KEY,
    { expiresIn: '1h' }
  );
}

module.exports = {
  Query: {
    async user(_, args, context) {
      try {
        const authUser = checkAuth(context);
        const user = await User.findById(authUser.id);
        return user;
      } catch (err) {
        throw new Error(err);
      }
    }
  },

  Mutation: {
    async login(_, { email, password }) {
      const user = await User.findOne({ email });

      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Wrong crendetials';
        throw new UserInputError('Wrong crendetials', { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token
      };
    },

    async register(_, { name, email, password }) {
      const user = await User.findOne({ email });
      if (user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is taken'
          }
        });
      }
      // hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        name,
        password
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token
      };
    }
  }
};
