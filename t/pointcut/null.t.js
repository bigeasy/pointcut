require('proof')(2, function (assert) {
    var prototype = require('../..').prototype

    function Service (greeting) {
        this.greeting = greeting
    }

    var method = function (callback) { callback(null, this.greeting) }
    prototype(Service, 'greet', method)

    assert(method === Service.prototype.greet)
    var service = new Service('Hello, World!')
    service.greet(function (error, greeting) {
        assert(greeting, 'Hello, World!')
    })
})
