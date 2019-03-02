const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const linebot = require('linebot')
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const socket = require('socket.io');

const lineRoute = require('./routes/line');
const webRoute = require('./routes/web')
const settings = require('./settings');
const socketRoute = require('./routes/socket')

const app = express();
app.set('port',process.env.PORT || 3000)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	secret: settings.cookieSecret,
	key: settings.db, //cookie name
	cookie: {maxAge: 3 * 60 * 60 * 1000}, //30days
	store: new MongoStore({
		db: settings.db,
		host: settings.host,
		port: settings.port,
		url: 'mongodb://angleeOwner:2842l3u03@127.0.0.1:27017/self'
	})
}));

const bot = linebot({
  channelId : process.env.CHANNEL_ID1,
  channelSecret: process.env.CHANNEL_SECRET1,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN1
});

const linebotParser = bot.parser();

bot.listen('/linewebhook', 3000, () => {
  console.log('server listen on 3000!!');
});

app.listen(3001, function() {
	console.log('Express server listening on port 3001');
});

const io = socket.listen(3002);

lineRoute(app, bot, linebotParser);
webRoute(app);
socketRoute(io);


module.exports = app;
