exports.validateRegister = (email, name, password) => {
  if (!email.includes('@')) {
    return [
      {
        field: 'email',
        message: 'invalid email'
      }
    ];
  }

  if (name.length <= 2) {
    return {
      errors: [
        {
          field: 'name',
          message: 'length must be greater than 2'
        }
      ]
    };
  }

  if (name.includes('@')) {
    return [
      {
        field: 'name',
        message: 'cannot include an @'
      }
    ];
  }

  if (password.length <= 2) {
    return [
      {
        field: 'password',
        message: 'length must be greater than 2'
      }
    ];
  }

  return null;
};
