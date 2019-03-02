const mongoose = require('mongoose');
module.exports = {
	user: mongoose.createConnection('mongodb://angleeUser:123456@127.0.0.1:27017/self?ssh=true', { useNewUrlParser: true }),
	owner: mongoose.createConnection('mongodb://angleeOwner:2842l3u03@127.0.0.1:27017/self?ssh=true', { useNewUrlParser: true })
}
