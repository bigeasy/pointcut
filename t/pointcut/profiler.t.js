require('proof')(2, require('cadence')(function (step, assert) {
    var profiler = require('../../profiler')(__filename)
    var pointcut = {
        entries: [],
        log: function (object) {
            this.entries.push(object)
        }
    }
    function Service () { }
    var method = function (value, callback) {
        callback(null, value)
    }
    Service.prototype.method = profiler.advise(pointcut, Service, 'method', method, method)
    var service = new Service
    step(function () {
        service.method(1, step())
    }, function (value) {
        assert(value, 1, 'arguments forwarded')
        assert(pointcut.entries.length, 1, 'entry logged')
        assert.say(pointcut.entries)
    })
}))
