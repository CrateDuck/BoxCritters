/*

Copy Bot
programmed by CrateDuck

/dab

*/
console.stdlog = console.log.bind(console);
console.logs = [];
console.log = function(){
    console.logs.push(Array.from(arguments));
    console.stdlog.apply(console, arguments);
}

console.stdlog.apply(console, "INJECTED");