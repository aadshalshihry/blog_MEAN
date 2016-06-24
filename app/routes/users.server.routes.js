var users = require('../../app/controllers/users.server.controller'),
    passport = require('passport');

module.exports = function (app) {
  app.route('/users')
  .post(users.create)
  .get(users.list);

  app.route('/users/:userId')
    .get(users.read)
    .put(users.update)
    .delete(users.delete);

  app.route('/signup')
    .get(users.renderSingup)
    .post(users.signup);

  app.route('/signin')
    .get(users.renderSingin)
    .post(passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/signin',
      failuerFlash: true
    }));

  app.get('/signout', users.signout);

  app.param('userId', users.userByID);
};
