var users = require('../../app/controllers/users.server.controller'),
var articles = require('../../app/controllers/articles.server.controller'),
    passport = require('passport');

module.exports = function (app) {
  app.route('/api/articles')
  .post(users.requiresLogin, articles.create)
  .get(articles.list);

  app.route('/api/articles/:articleId')
    .get(articles.read)
    .put(users.requiresLogin, articles.hasAuthorization, articles.update)
    .delete(users.requiresLogin, articles.hasAuthorization, articles.delete);

  app.param('articleId', articles.articleByID);
};
