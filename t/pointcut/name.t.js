require('proof')(8, prove)

function prove (assert) {
    var name = require('../../name')

    function Program () {
    }

    Program.prototype.foo = function () {
        return name(new Error().stack)
    }

    Program.prototype.bar = function frobinate () {
        return name(new Error().stack)
    }

    var program = new Program

    assert(program.foo(), 'Program.foo', 'called on object')
    assert(Program.prototype.foo(), 'Program.foo', 'called on prototype')

    assert(program.bar(), 'Program.bar', 'renamed called on object')
    assert(Program.prototype.bar(), 'Program.bar', 'renamed called on prototype')

    function pointcut(prototype, method) {
        prototype[method] = function () { return name(new Error().stack) }
        assert(prototype[method](), 'Program.baz', 'placeholder')
    }
    pointcut(Program.prototype, 'baz')

    function named () {
        return name(new Error().stack)
    }

    assert(named(), 'named', 'named')

    var f = function () {
        return name(new Error().stack)
    }

    assert(f(), 'f', 'inferred anonymous')

    try {
        ! function () { name(new Error().stack) } ()
    } catch (e) {
        assert(e.message, 'unable to determine function name', 'unable')
    }
}
