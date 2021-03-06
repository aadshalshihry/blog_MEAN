var config = require('./config'),
    http = require('http'),
    socketio = require('socket.io'),
    express = require('express'),
    morgan = require('morgan'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    flash = require('connect-flash');
    passport = require('passport'),
    MongoStore = require('connect-mongo')(session);


module.exports = function (db) {
  var app = express();
  var server = http.createServer(app);
  var io = socketio.listen(server);

  if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
  } else if (process.env.NODE_ENV === 'production'){
    app.use(compress());
  }

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());
  app.use(methodOverride());


  var mongoStore = new MongoStore({
        // db: db.connection.db
        mongooseConnection: db.connection
    });

	// Configure the 'session' middleware
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret,
		store: mongoStore
	}));

  app.set('views', './app/views');
  app.set('view engine', 'ejs');

  app.use(flash());

  app.use(passport.initialize());
  app.use(passport.session());

  // Routes
  require('../app/routes/index.server.routes.js')(app);
  require('../app/routes/about.server.routes.js')(app);
  require('../app/routes/users.server.routes.js')(app);
  require('../app/routes/posts.server.routes.js')(app);
  require('../app/routes/articles.server.routes.js')(app);
  // require('./socketio')(server, io, mongoStore);

  // call for static files always below the call of routes to make faster
  app.use(express.static('./public'));
  return app;
}
