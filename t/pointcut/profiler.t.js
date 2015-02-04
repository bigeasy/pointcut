require('proof')(2, require('cadence')(prove))

function prove (async, assert) {
    var profiler = require('../../profiler')(__filename)
    var pointcut = {
        entries: [],
        log: function (object) {
            this.entries.push(object)
        }
    }
    function Service () { }
    var method = function (value, callback) {
        console.log('called', value)
        setImmediate(done)

        if (value != 1) {
            this.method(value - 1, done)
            this.method(value - 1, done)
        }

        var count = value == 1 ? 2 : 0
        function done () {
            if (++count == 3) {
                callback(null, value)
            }
        }
    }
    Service.prototype.method = profiler.advise(pointcut, Service, 'method', method, method)
    var service = new Service
    async(function () {
        service.method(3, async())
    }, function (value) {
        assert(value, 1, 'arguments forwarded')
        assert(pointcut.entries.length, 1, 'entry logged')
        assert.say(pointcut.entries)
    })
}
