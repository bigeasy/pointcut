var slice = [].slice

function Profiler (filename) {
    this._filename = filename
}

var nextInstance = 0
var instance = nextInstance++
var nextIdentifier = 0

Profiler.prototype.advise = function (pointcut, constructor, name, wrapped, original) {
    var filename = this._filename
    var identifier = nextIdentifier++
    pointcut.log({
        advisor: 'profiler',
        identifier: identifier,
        source: filename,
        'class': constructor.name,
        method: name
    })
    return function () {
        var start = process.hrtime(), vargs = slice.call(arguments), callback = vargs.pop()
        var caller = instance
        var callee = instance = nextInstance++
        pointcut.log({
            advisor: 'profiler',
            identifier: identifier,
            caller: caller,
            callee: callee,
            start: start,
            duration: process.hrtime(start)
        })
        wrapped.apply(this, vargs.concat(function () {
            pointcut.log({
                advisor: 'profiler',
                caller: caller,
                callee: callee,
                duration: process.hrtime(start)
            })
            instance = caller
            callback.apply(this, slice.call(arguments))
        }))
        instance = caller
    }
}

module.exports = function (filename) {
    return new Profiler(filename)
}
