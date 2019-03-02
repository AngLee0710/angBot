const request = require('request');
const BD = require('../models/db/health/bodyDetail.js')
const E = require('../models/db/health/eat')
const BP = require('../models/db/health/bloodPressure')
const U = require('../models/db/general/user.js')

module.exports = function(app) {
    app.get('/', ifNotLogin);
    app.get('/', (req, res) => {
      res.redirect('/line');
    });
    
    app.get('/profile', ifLogin)
    app.get('/profile', (req, res) => {
        BD.getNewDetail(req.session.user_id, (err, newBD) => {
          if(err) {
            console.log(err);
          } else {
            U.getHeight(req.session.user_id, (err, H) => {
              if(err) {
                console.log(err)
              } else {
                res.render('profile', {
                  title: 'iBody',
                  name: req.session.user_name,
                  photo: req.session.user_photo,
                  newBD: newBD,
                  height: H
                })
              }
            })
          }
        });
    });

    app.get('/eat', ifLogin)
    app.get('/eat', (req, res) => {
      res.render('eat', {
        title: 'iBody',
        name: req.session.user_name
      })
    });

    app.get('/bloodPressure', ifLogin)
    app.get('/bloodPressure', (req, res) => {
      res.render('bloodPressure', {
        title: 'iBody',
        name: req.session.user_name
      })
    });

    app.get('/game', ifLogin)
    app.get('/game', (req, res) => {
      res.render('game', {
        title: 'iBody',
        user: req.session.user_id
      })
    })
  
    app.get('/line', (req, res) => {
      let url = 'https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=';
  
      let CHANNEL_ID = process.env.CHANNEL_ID2;
      let CHANNEL_SECRET = process.env.CHANNEL_SECRET2;
      let callback = 'https://www.anglinebot2.ga/line/callback';
  
      url += CHANNEL_ID + '&redirect_uri=' + callback;
  
      url += '&state=rw;lerk3m525b-2ipwjjttghahkdjopiseh59yj3jgopjfglksajoghoighjdshjpkdhpkdfhdfhfhdfhkjdfhdhdfhlkjdfhdfh&scope=openid%20profile&nonce=fakfgalakkklafkaskf';
  
      return res.redirect(url);
    })
  
    app.get('/line/callback', (req, res) => {

      let code = req.query.code;
      
      let token = {
        url: 'https://api.line.me/oauth2/v2.1/token',
        method: 'POST',
        form: {
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: 'https://www.anglinebot2.ga/line/callback',
          client_id: process.env.CHANNEL_ID2,
          client_secret: process.env.CHANNEL_SECRET2
        }
      }
  
      request(token, (err, res2, body) => {
        if(!err || res2.statusCode == 200) {
          let access_token = JSON.parse(body).access_token;
          let info_option = {
            url: 'https://api.line.me/v2/profile',
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + access_token
            }
          }
  
          request(info_option, (err, res3, body) => {
            if(!err || res3.statusCode == 200) {
              req.session.user_id = JSON.parse(body).userId;
              req.session.user_name = JSON.parse(body).displayName;
              req.session.user_photo = JSON.parse(body).pictureUrl;
              console.log(req.session.user_photo);
  
              res.redirect('/profile');
            }
          });
        }
      });
    })

    app.get('/line/logout', ifLogin)
    app.get('/line/logout', (req, res) => {
        req.session.user_id = null;
        req.session.user_name = null;
        req.session.user_photo = null;
        res.redirect('/');
    })

    app.get('/api/bodyDetail/history', ifLogin)
    app.get('/api/bodyDetail/history', (req, res) => {
        BD.limitWeek(req.session.user_id, (err, historyBD) => {
            if(err) {
                console.log(err);
            } else {
                res.send(historyBD);
            }
        })
    });

    app.get('/api/eat/history', ifLogin)
    app.get('/api/eat/history', (req, res) => {
      E.getHistroy(req.session.user_id, (err, docs) => {
          if(err) {
              console.log(err);
          } else {
              
              const promise = new Promise(function(resolve, reject) {
                for(let i = 0 ; i < docs.length ; i++) {
                  docs[i].Eat = docs[i].Eat.replace(/\n/g, '<br />');
                }
                resolve();
              })

              promise.then(function() {
                console.log(docs);
                res.send(docs);
              })
          }
      })
    });

    app.get('/api/bloodPressure/history', ifLogin)
    app.get('/api/bloodPressure/history', (req, res) => {
      BP.getAllHistory(req.session.user_id, (err, docs) => {
          if(err) {
              console.log(err);
          } else {
              res.send(docs);
          }
      })
    });

}

function ifLogin(req, res, next) {
  if(req.session.user_id == null) {
    res.redirect('/');
  } else {
    next();
  }
}

function ifNotLogin(req, res, next) {
  if(req.session.user_id != null) {
    res.redirect('/profile')
  } else {
    next();
  }
}