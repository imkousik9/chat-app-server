const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const checkAuth = require('../../util/auth');
const { validateRegister } = require('../../util/validateRegister');

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id
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

        return await User.findById(authUser.id);
      } catch (err) {
        throw new Error(err);
      }
    }
  },

  Mutation: {
    async login(_, { email, password }) {
      const user = await User.findOne({ email });

      if (!user) {
        return {
          errors: [
            {
              field: 'email',
              message: "this email doesn't exist"
            }
          ]
        };
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return {
          errors: [
            {
              field: 'password',
              message: 'incorrect password'
            }
          ]
        };
      }

      const token = generateToken(user);

      return {
        user: { ...user._doc, id: user._id, token }
      };
    },

    async register(_, { name, email, password }) {
      const user = await User.findOne({ email });

      const errors = validateRegister(email, name, password);

      if (user) {
        return {
          errors: [
            {
              field: 'email',
              message: 'email already taken'
            }
          ]
        };
      }

      if (errors) {
        return {
          errors
        };
      }

      password = await bcrypt.hash(password, 12);

      const newUser = await User.create({
        email,
        name,
        password
      });

      const token = generateToken(newUser);

      return { user: { ...newUser._doc, id: newUser._id, token } };
    }
  }
};
