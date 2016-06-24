var Article = require('mongoose').model('Article');

var getErrorMessage = function (err) {
  if(err.errors){
    for (var errName in err.errors) {
      if (err.errors[errName].message) {
        return err.errors[errName].message;
      }
    }
  } else {
    return 'Unknown server error';
  }
}
exports.create = function (req, res, next) {
  var article = new Article(req.body);
  article.creator = req.user;
  article.save(function (err) {
    if(err){
      return res.status(400).send({
        message: getErrorMessage(err);
      });
    } else {
      res.json(article);
    }
  });
};

exports.listOld = function (req, res, next) {
  Article.find({}, function (err, article) {
    if(err){
      return next(err);
    } else {
      res.json(article);
    }
  });
};

exports.list = function (req, res) {
  Article.find().sort('-created').populate('creator', 'firstName lastName fullName')
  .exec(function (err, articles) {
    if(err){
      return res.status(400).send({
        message: getErrorMessage(err);
      });
    } else {
      res.json(articles);
    }
  })
}

exports.read = function (req, res) {
  res.json(req.article);
}

exports.articleByID_old = function (req, res, next, id) {
  Article.findOne({
    _id: id
  }, function (err, article) {
    if (err) {
      return next(err);
    } else {
      req.article = article;
      next();
    }
  });
};

exports.articleByID = function (req, res, next, id) {
    article.findOne(id).populate('creator', 'firstName lastName fullName')
    .exec(function (err, article) {
      if(err) return next(err);
      if(!article) return next(new Error('Faild to load article ' + id));
      req.article = article;
      next();
    });
};



exports.updateOld = function (req, res, next) {
  Article.findByIdAndUpdate(req.article.id, req.body, function (err, article) {
    if (err){
      return next(err);
    } else {
      res.json(user)
    }
  });
};

exports.update = function (req, res) {
  var article = req.article;

  article.title = req.body.title;
  article.content = req.body.content;
  article.save(function (err) {
    if(err){
      return res.status(400).send({
        message: getErrorMessage(err);
      });
    } else {
      res.json(article);
    }
  });
};

exports.delete = function (req, res) {
  var article = req.article;

  article.remove(function (err) {
    if(err){
      return res.status(400).send({
        message: getErrorMessage(err);
      });
    } else {
      res.json(article);
    }
  });
};

exports.deleteOld = function (req, res, next) {
  req.article.remove(function (err) {
    if(err){
      return next(err);
    } else {
      res.json(req.article);
    }
  });
};

exports.requiresLogin = function (req, res, next) {
  if(!req.isAuthenticated()){
    return res.status(401).send({
      message: 'User is not logged in'
    });
  }
  next();
};

exports.hasAuthorization = function (req, res, next) {
  if(req.article.creator.id !== req.user.id){
    return res.status(403).send({
      message: 'User is not authorized'
    });
  }
  next();
};
