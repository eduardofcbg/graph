
//get input from form action
var RESOLUTION = parseFloat(getParameterByName("r"));
var MAX = parseInt(getParameterByName("max"));
var MIN = parseInt(getParameterByName("min"));
var SPEED = parseInt(getParameterByName("t"));
var FUNC = "f(x, y, t) = " + getParameterByName("f");

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

//parse input
var parser = math.parser();
parser.eval(FUNC);
var f = parser.get('f');

start(RESOLUTION, MAX, MIN, SPEED, f);
