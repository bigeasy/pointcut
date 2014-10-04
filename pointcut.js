var fs = require('fs'),
    stream = require('stream'),
    util = require('util')

function Pointcut () {
    stream.Readable.call(this)
    this.advice = [{
        advise: function (pointcut, type, name, wrapped, original) {
            return wrapped
        }
    }]
    this.prototype = function (type, name, method) {
        var pointcut = this
        type.prototype[name] = this.advice.reduce(function (wrapped, advice) {
            return advice.advise(pointcut, type, name, wrapped, method)
        }, method)
    }.bind(this)
    this._entries = []
    this._callbacks = []
    this._blocked = true
}
util.inherits(Pointcut, stream.Readable)

Pointcut.prototype._read = function () {
    var blocked = this._blocked
    this._blocked = false
    if (blocked) {
        this._write()
    }
}

Pointcut.prototype._write = function () {
    if (this._entries.length) {
        this._entries.push('')
        this._blocked = !this.push(this._entries.join('\n'), 'utf8')
        this._entries.length = 0
    }
    if (this._shutdown) {
        this._callbacks.forEach(function (callback) { callback() })
    } else if (!this._blocked) {
        this._timeout = setTimeout(this._write.bind(this), 250)
    }
}

Pointcut.prototype.shutdown = function (callback) {
    if (this._shutdown) {
        callback()
    } else {
        this._callbacks.push(callback)
        this._shutdown = true
    }
}

Pointcut.prototype.log = function (object) {
    this._entries.push(JSON.stringify(object))
}

module.exports = new Pointcut
