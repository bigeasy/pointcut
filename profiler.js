var __slice = [].slice

function Profiler (filename) {
    this._filename = filename
}

Profiler.prototype.advise = function (pointcut, constructor, name, wrapped, original) {
    var filename = this._filename
    return function () {
        var start = process.hrtime(), vargs = __slice.call(arguments), callback = vargs.pop()
        wrapped.apply(this, vargs.concat(function () {
            pointcut.log({
                advisor: 'profiler',
                start: start,
                source: filename,
                'class': constructor.name,
                method: name,
                duration: process.hrtime(start)
            })
            callback.apply(this, __slice.call(arguments))
        }))
    }
}

module.exports = function (filename) {
    return new Profiler(filename)
}
