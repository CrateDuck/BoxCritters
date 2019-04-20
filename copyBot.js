console.defaultLog = console.log.bind(console);
console.info = function() {
    console.defaultLog.apply(console, arguments);
    let e = Array.from(arguments);
    if(e[0] == "M") {
	world.sendMessage(e[1].m);
    }
}
