// Follow & Copy Someone
let active = '-- TARGET NAME HERE --';
let lastx = 0;
let lasty = 0;
let players = world.room.playerlist;
setInterval(() => {
Object.keys(players).forEach((player) => {
	if(players[player]['nickname']['children'][0]['text'] == active) {			
		if(lastx !=players[player].x && lasty != players[player].y) {
			socket.emit('click', {
				x: players[player].x,
				y: players[player].y
			});
			lastx = players[player].x;
			lasty = players[player].y;
			world.sendMessage('I\'m going to annoying you now.');
		}
	}
});
}, 100);

console.defaultLog = console.log.bind(console);
console.info = function() {
    console.defaultLog.apply(console, arguments);
    let e = Array.from(arguments);
    if(e[0] == "M" && e[1].n == active) {
	    world.sendMessage(e[1].m);
    }
}
