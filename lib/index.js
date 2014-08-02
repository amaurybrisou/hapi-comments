var captchagen = require('captchagen'),
  MongoClient = require('mongodb').MongoClient,
  Joi = require('joi'),
  Hapi = require('hapi'),
  internals = {}


internals.fetchDb = function (db, id, res) {
  db
    .collection(db.dbName)
    .find({
      HC_Id: id
    }, {
      HC_textarea: true,
      HC_nickname: true,
      HC_date: true
    })
    .sort({
      date: 1
    })
    .limit(50)
    .toArray(function (err, docs) {
      res(docs)
    });
}

internals.add = function (req, res) {
  var p = req.payload
  if (internals.captcha_text !== p.HC_captcha_validate) {
    internals.genCaptcha()
    res(Hapi.error.badRequest('Captcha Error'))
    return
  }

  var that = this
  req.payload.HC_date = new Date().toUTCString()
  this.db.collection(this.db.dbName).insert(req.payload, {
    safe: true
  }, function (err, objs) {
    if (err) throw err
    if (err && err.message.indexOf('E11000 ') !== -1) {
      res(Hapi.error.badRequest('Duplicate comment'))
    }
    internals.genCaptcha()
    internals.fetchDb(that.db, req.payload.HC_Id, res)
  })


}


internals.get = function (req, res) {

  if (!req.query.HC_Id) {
    res();
  }
  internals.fetchDb(this.db, req.query.HC_Id, res)
}

internals.genCaptcha = function (res) {
  var captcha = captchagen.create()

  captcha.text()
  captcha.generate()

  internals.captcha_text = captcha.text()
  internals.captcha_stream = captcha.buffer()
  return internals.captcha_stream
}

internals.captcha = function (req, res) {
  res(internals.genCaptcha())
}

internals.failAction = function (source, err, res) {
  internals.genCaptcha()
  res(err)
}

internals.updateCaptcha = function (req, res) {
  res(internals.captcha_stream).type('image/png')
}


internals.routes = [{
  path: "/",
  method: "POST",
  config: {
    handler: internals.add,
    validate: {
      failAction: internals.failAction,
      query: false,
      params: false,
      payload: {
        HC_textarea: Joi.string().max(512).required(),
        HC_nickname: Joi.string().max(255).required(),
        HC_email: Joi.string().email().max(255).required(),
        HC_captcha_validate: Joi.string().alphanum().required(),
        HC_Id: Joi.string().max(100).required()
      }
    }
  }
}, {
  path: "/",
  method: "GET",
  config: {
    handler: internals.get
  }
}, {
  path: "/updateCaptcha",
  method: "GET",
  config: {
    handler: internals.updateCaptcha
  }
}, {
  path: "/captcha",
  method: "GET",
  handler: internals.captcha
}, {
  path: "/js/{path*}",
  method: "GET",
  handler: {
    directory: {
      path: __dirname + "/public/js/",
      listing: true,
      index: false
    }
  }
}, {
  path: "/css/{path*}",
  method: "GET",
  handler: {
    directory: {
      path: __dirname + "/public/css/",
      listing: true,
      index: false
    }
  }
}]


var register = function (plugin, options, next) {

  plugin.route(internals.routes)



  MongoClient.connect('mongodb://127.0.0.1:27017/' + options.dbName,
    function (err, db) {
      if (err) throw err

      if (options.drop) {
        db.collection(options.dbName).drop()
      }
      db.dbName = options.dbName
      plugin.bind({
        db: db
      })

      next()
    })
}

register.attributes = {
  name: 'hapi-comments',
  pkg: require('../package.json')
}

module.exports = register