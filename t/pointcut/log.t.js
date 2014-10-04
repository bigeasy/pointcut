require('proof')(3, require('cadence')(function (step, assert) {
    var pointcut = require('../..')
    var readable
    function block () { readable = true }
    pointcut.on('readable', block)
    step(function () {
        // fill the default 16k buffer, do not read it.
        for (var i = 0; i < 2048; i++ ) {
            pointcut.log({ count: i })
        }
        setTimeout(step(), 275)
    }, function () {
        assert(pointcut._blocked, 'readable')
        assert(pointcut._blocked, 'blocked')
        var lines = pointcut.read().toString().split(/\n/)
        lines.pop()
        lines = lines.map(function (json) { return JSON.parse(json) })
        assert(lines.slice(0, 2), [{ count: 0 }, { count: 1 }], 'lines')
        pointcut.log({ count: 2048 })
        setTimeout(step(), 275)
    }, function () {
        pointcut.shutdown(step())
    }, function () {
        pointcut.shutdown(step())
    })
}))
