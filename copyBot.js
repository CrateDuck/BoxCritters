// TO COPY ONE ACCOUNT:
// TURN THE BOTS ON BY SAYING -toggle with your MAIN ACCOUNT.
console.defaultLog = console.log.bind(console);
let enabled = false;
console.info = function() {
    console.defaultLog.apply(console, arguments);
    let e = Array.from(arguments);
    if(e[0] == "M" && e[1].n == '-- YOUR USERNAME HERE--') {
	if(e[1].m == '-toggle') {
		enabled = !enabled;
		world.sendMessage('Annoying Bot: ' + enabled);
	} else {
		if(enabled) {
			world.sendMessage(e[1].m);
		}
	}
    }
}

// TO COPY EVERYONE:

console.defaultLog = console.log.bind(console);
console.info = function() {
    console.defaultLog.apply(console, arguments);
    let e = Array.from(arguments);
    if(e[0] == "M" && e[1].n != world.player.nickname) {
		world.sendMessage(e[1].m);
    }
}
