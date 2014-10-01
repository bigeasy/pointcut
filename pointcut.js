var fs = require('fs')

function Pointcut () {
    this.adornments = [{
        adorn: function (type, name, wrapped, original) {
            return wrapped
        }
    }]
    this.prototype = function (type, name, method) {
        type.prototype[name] = this.adornments.reduce(function (wrapped, adornment) {
            return adornment.adorn(type, name, wrapped, method)
        }, method)
    }.bind(this)
}

Pointcut.prototype._flush = function () {
    this._log = fs.createWriteStream('pointcut.log', { flags: 'r+', })
    this._flush = function () {
        var draining
        if (this._timeout) {
            clearTimeout(this._timeout)
            this._timeout = null
        }
        if (this._entries.length) {
            this._entires.push('')
            if (draining = !this._log.write(this._entries.join('\n'))) {
                this._log.on('drain', this._flush.bind(this))
            }
            this._entries.length = 0
        }
        if (!draining && !this._shutdown) {
            this._timeout = setTimeout(this._flush.bind(this), 250)
        }
    }
    this._flush()
}

Pointcut.prototype.shutdown = function () {
    this._shutdown = true
    this._flush()
    this._log.close()
}

Pointcut.prototype.log = function (object) {
    this._entries.push(JSON.stringify(object))
}

Pointcut.prototype.method = function (filename) {
    var pointcut = this
    return function (constructor, name, method) {
        constructor.prototype[name] = function () {
            var start = process.hrtime(), vargs = __slice.call(arguments), callback = vargs.pop()
            method.apply(this, vargs.concat(function () {
                pointcut.log({
                    source: filename,
                    'class': constructor.name,
                    method: name,
                    duration: process.hrtime(start)
                })
                callback.apply(this, __slice.call(arguments))
            }))
        }
    }
}

module.exports = new Pointcut
