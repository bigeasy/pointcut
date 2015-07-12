module.exports = function name (stack) {
    stack = stack.split(/\n/)
    var entry = stack[1], $
    if ($ = /^    at (\S+).prototype.\(anonymous function\) \[as ([^\]]+)\]/.exec(entry)) {
        return $[1] + '.' + $[2]
    }
    if ($ = /^    at (\S+) \[as ([^\]]+)\]/.exec(entry)) {
        return $[1].replace(/[^.]+$/, $[2])
    }
    if ($ = /^    at (\S+) /.exec(entry)) {
        return $[1]
    }
    throw new Error('unable to determine function name')
}
