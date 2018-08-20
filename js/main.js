function getParameterByName(name) {
    var cleanedName = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + cleanedName + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function start() {
    var resolution = parseFloat(getParameterByName("r"));
    var max = parseInt(getParameterByName("max"));
    var min = parseInt(getParameterByName("min"));
    var speed = parseInt(getParameterByName("t"));
    var func = "f(x, y, t) = " + getParameterByName("f");

    var parser = math.parser();
    parser.eval(func);
    var f = parser.get('f');

    graph(resolution, min, max, speed, f);
}

window.onload = start;