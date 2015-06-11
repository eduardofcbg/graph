
//get input from form action
RESOLUTION = parseFloat(getParameterByName("r"));
MAX = parseInt(getParameterByName("max"));
MIN = parseInt(getParameterByName("min"));
SPEED = parseInt(getParameterByName("t"));
FUNC = "f(x, y, t) = " + getParameterByName("f");

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
