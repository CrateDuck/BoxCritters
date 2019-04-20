function World(e, t) {
    console.log("Creating a new World!"), this.room, this.player, this.events = {}, this.stage = new createjs.Stage(e), this.stage.room = new createjs.Container, this.stage.ui = new createjs.Container, this.stage.gear = new createjs.Container, this.stage.card = new createjs.Container, this.stage.beep = new createjs.Container, this.stage.addChild(this.stage.room, this.stage.ui, this.stage.gear, this.stage.card, this.stage.beep), t && (this.socket = t, this.socketHandler(t));
    var i = this;
    createjs.Ticker.framerate = 60, createjs.Ticker.on("tick", function(e) {
        i.stage.update(e)
    })
}

function Beep(e, t) {
    this.socket = e || {}, this.world = t || {}, this.mc = new createjs.Container;
    var i = this;
    e && e.on("beep", function(e) {
        console.log("beep", e), e.item && i.showItem(e.item)
    })
}

function Button(e) {
    createjs.Container.call(this);
    var t = new createjs.Sprite(uxSS, e);
    this.addChild(t)
}

function Code(e, t) {
    this.socket = e, this.world = t;
    var i = this;
    t.on("code", function(e) {
        i.handleMessage(e)
    })
}

function ItemIcon(e, t) {
    createjs.Container.call(this), this.slotId = t, this.itemId = e, this.isActive = !1, this.handleClick, this.background = new createjs.Sprite(uxSS, "item");
    var i = new createjs.Bitmap("/media/29-bunny/icons/" + e + ".png");
    i.x = 2, i.y = 2, i.scaleX = .5, i.scaleY = .5, this.addChild(this.background, i)
}

function Player(e) {
    this.playerId = e.playerId, this.nickname = e.nickname, this.critterId = e.critterId, this.inventory = e.inventory, this.friends = e.friends, this.gear = e.gear || {}, this.status, this.level, this.weapon, this.def = 10, this.str = 10, this.armour, this.isDead, this.gold = e.gold, this.goldInBank, this.xp, this.hp = 100, this.mp, this.gems
}

function Room(e, t) {
    if (createjs.Container.call(this), this.background = new createjs.Container, this.foreground = new createjs.Container, this.game = new createjs.Container, this.balloons = new createjs.Container, this.nicknames = new createjs.Container, this.player = t, this.game.addEventListener("tick", function(e) {
            e.target.children.sort(sortDepth)
        }), e.artwork && e.artwork.sprites && (e.artwork.sprites.images[0] = "/media/29-bunny/rooms/" + e.artwork.sprites.images[0], this.spritesheet = new createjs.SpriteSheet(e.artwork.sprites)), this.playerlist = {}, e.artwork && void 0 !== e.artwork.background) {
        var i = new createjs.Bitmap("/media/29-bunny/rooms/" + e.artwork.background);
        this.background.addChild(i)
    }
    if (this.addChild(this.background), this.addChild(this.game), e.artwork && void 0 !== e.artwork.foreground) {
        var r = new createjs.Bitmap("/media/29-bunny/rooms/" + e.artwork.foreground);
        this.foreground.addChild(r)
    }
    if (this.addChild(this.foreground), this.addChild(this.nicknames), this.addChild(this.balloons), e.artwork && void 0 !== e.artwork.props)
        for (var a = 0; a < e.artwork.props.length; a++) {
            var s = e.artwork.props[a],
                o = new createjs.Sprite(this.spritesheet);
            o.gotoAndStop(s[0]), o.x = s[1], o.y = s[2], this.game.addChild(o)
        }
    if (null != e.playerlist)
        for (a = 0; a < e.playerlist.length; a++) this.addPlayer(e.playerlist[a])
}

function sortDepth(e, t) {
    return e.y - t.y
}

function createBalloon(e, t) {
    var i = t + 20,
        r = e + 20,
        a = new createjs.Shape;
    return a.graphics.setStrokeStyle(1).beginStroke("#888888").beginFill("#FFFFFF"), a.graphics.moveTo(5, 0).arcTo(r, 0, r, 5, 5).arcTo(r, i, r - 5, i, 5).lineTo(80, i).lineTo(70, i + 10).lineTo(70, i).arcTo(0, i, 0, i - 5, 5).arcTo(0, 0, 5, 0, 5), a.x = 0 - r / 2, a.y = -10, a
}

function BeepItem(e) {
    this.mc = new createjs.Container;
    var t = new createjs.Graphics;
    t.beginFill("black"), t.drawRect(0, 100, 850, 200);
    var i = new createjs.Shape(t);
    this.mc.addChild(i);
    var r = new createjs.Bitmap("/media/29-bunny/icons/" + e.itemId + ".png");
    r.regX = 80, r.regY = 80, r.x = 425, r.y = 120, this.mc.addChild(r), e.name && (e.title = e.name);
    var a = new createjs.Text(e.title, "40px Luckiest Guy", "#ffffff");
    if (a.textAlign = "center", a.lineHeight = 40, a.lineWidth = 400, a.x = 425, a.y = 210, this.mc.addChild(a), e.text) {
        var s = new createjs.Text(e.text, "16px Arial", "#AAAAAA");
        s.textAlign = "center", s.lineWidth = 300, s.x = 425, s.y = 250, this.mc.addChild(s)
    }
}
World.prototype.on = function(e, t) {
    "object" != typeof this.events[e] && (this.events[e] = []), this.events[e].push(t)
}, World.prototype.emit = function(e) {
    var t, i, r, a = [].slice.call(arguments, 1);
    if ("object" == typeof this.events[e])
        for (r = (i = this.events[e].slice()).length, t = 0; t < r; t++) i[t].apply(this, a)
}, World.prototype.socketHandler = function(i) {
    var r = this;
    this.stage;
    i.on("connect", function() {}), i.on("disconnect", function() {
        console.log("DISCONNECT")
    }), i.on("login", function(e) {
        console.log("login", e);
        var t = new Player(e);
        r.player = t, i.emit("joinRoom", {
            roomId: "tavern"
        })
    }), i.on("message", function(e) {
        console.log("message", e)
        console.log("This is a sign of injection!")
    }), i.on("joinRoom", function(e) {
        console.log("joinRoom", e), r.addRoom(e), r.addRoomUI(), r.addInventoryScreen()
    }), i.on("playerData", function(e) {
        console.log("playerData", e), r.player.updateData(e)
    }), i.on("roomData", function(e) {
        console.log("roomData", e)
    }), i.on("worldData", function(e) {
        console.log("worldData", e)
    }), i.on("A", function(e) {
        console.info("A", e), r.room.addPlayer(e)
    }), i.on("R", function(e) {
        console.info("R", e), r.room.removePlayer(e)
    }), i.on("G", function(e) {
        console.info("G", e), r.room.updateGear(e)
    }), i.on("X", function(e) {
        r.room.movePlayer(e)
    }), i.on("M", function(e) {
        console.info("M", e), r.room.addBalloon(e)
    })
}, World.prototype.login = function(e) {
    this.socket.open(), this.socket.emit("login", {
        ticket: e
    })
}, World.prototype.logout = function() {
    console.log("logout"), sessionStorage.clear(), this.socket.disconnect(), cheerioPath && (document.location.href = cheerioPath)
}, World.prototype.sendMessage = function(e) {
    if (console.log("sendMessage", e), "/" == (e = e.trim()).substr(0, 1)) this.emit("code", e);
    else {
        this.socket.emit("sendMessage", {
            message: e
        });
        var t = {
            i: this.player.playerId,
            n: this.player.nickname,
            m: e
        };
        console.info("M", t), this.room.addBalloon(t)
    }
}, World.prototype.updateGear = function(e) {
    this.socket.emit("updateGear", e)
}, World.prototype.addRoom = function(e) {
    console.log("Add Room!", e), this.room = new Room(e, this.player), this.room.background.on("click", function(e) {
        var t = Math.floor(e.stageX),
            i = Math.floor(e.stageY);
        socket.emit("click", {
            x: t,
            y: i
        })
    }), this.stage.room.addChild(this.room)
}, World.prototype.addRoomUI = function() {
    console.log("Add Room UI!");
    var e = new createjs.Container,
        t = new Button("box");
    t.scaleX = .5, t.scaleY = .5, t.x = 760, t.y = 420;
    var i = this;
    t.click(function() {
        i.inventory.show()
    }), e.addChild(t), this.stage.ui.addChild(e)
}, World.prototype.addInventoryScreen = function() {
    console.log("Add Inventory Screen!"), this.inventory || (this.inventory = new InventoryScreen(this.player), this.inventory.hide(), this.stage.gear.addChild(this.inventory))
}, Beep.prototype.show = function() {
    var e = this,
        t = new createjs.Graphics;
    t.beginFill("black"), t.drawRect(0, 0, 850, 480);
    var i = new createjs.Shape(t);
    i.alpha = .6, i.on("click", function() {
        e.close()
    }), this.mc.addChild(i), this.mc.visible = !0
}, Beep.prototype.hide = function() {
    this.mc.visible = !1
}, Beep.prototype.close = function() {
    this.mc.removeAllChildren(), this.mc.visible = !1
}, Beep.prototype.showItem = function(e) {
    this.show();
    var t = new BeepItem(e);
    this.mc.addChild(t.mc)
}, Beep.prototype.showCard = function(e) {}, Beep.prototype.showWarning = function(e) {}, Button.prototype = Object.create(createjs.Container.prototype), Button.prototype.click = function(e) {
    this.on("click", e)
}, Code.prototype.handleMessage = function(e) {
    var t = e.split(" "),
        i = t.shift().substr(1).toLowerCase();
    switch (i) {
        case "nicknames":
            this.toggleNicknames();
            break;
        case "balloons":
            this.toggleBalloons();
            break;
        default:
            this.socket.emit("code", {
                code: i,
                options: t
            })
    }
}, Code.prototype.toggleNicknames = function() {
    var e = this.world.room.nicknames;
    e.visible ? e.visible = !1 : e.visible = !0
}, Code.prototype.toggleBalloons = function() {
    var e = this.world.room.balloons;
    e.visible ? e.visible = !1 : e.visible = !0
}, ItemIcon.prototype = Object.create(createjs.Container.prototype), ItemIcon.prototype.click = function(e) {
    this.on("click", e)
}, ItemIcon.prototype.setActive = function(e) {
    e ? (this.background.gotoAndStop("item_active"), this.isActive = !0) : (this.background.gotoAndStop("item"), this.isActive = !1)
}, Player.prototype.updateData = function(e) {
    console.info("updateData", e), e.gear && (this.gear = e.gear), e.inventory && this.inventory.push(e.inventory)
}, Player.prototype.addItem = function(e) {
    console.log("Player.addItem", e);
    var t = this.getItemFromInventory(e);
    t && (this.gear[t.slot] = t.itemId)
}, Player.prototype.removeItem = function(e) {
    console.log("Player.removeItem", e), delete this.gear[e]
}, Player.prototype.isItemActive = function(e) {
    for (var t in this.gear)
        if (this.gear[t] == e) return !0;
    return !1
}, Player.prototype.getItemFromInventory = function(e) {
    for (var t = 0; t < this.inventory.length; t++)
        if (this.inventory[t].itemId == e) return this.inventory[t]
}, Room.prototype = Object.create(createjs.Container.prototype), Room.prototype.sortDepth = function() {
    this.game.children.sort(sortDepth)
}, Room.prototype.addPlayer = function(e) {
    var t = e.i;
    if (null == this.playerlist[t]) {
        var i = new PlayerContainer(e);
        this.player.playerId == e.i && (i.isLocal = !0), i.x = e.x, i.y = e.y;
        var r = findDirection(e.r);
        i.updateDirection(r), i.updateState("stand"), this.game.addChild(i), this.playerlist[t] = i;
        var a = new createjs.Container;
        a.x = e.x, a.y = e.y, i.balloon = a, this.balloons.addChild(a);
        var s = new createjs.Container;
        s.x = e.x, s.y = e.y;
        var o = new createjs.Text(e.n, "12px Arial", "#000000");
        o.textAlign = "center", o.lineWidth = 100, o.y = 15, s.addChild(o), i.nickname = s, this.nicknames.addChild(s)
    }
}, Room.prototype.addBalloon = function(e) {
    var t = this.playerlist[e.i],
        i = new createjs.Container,
        r = new createjs.Text(e.m, "12px Arial", "#000000");
    r.textAlign = "center", r.lineWidth = 100;
    var a = r.getBounds(),
        s = createBalloon(100, a.height);
    i.addChild(s, r), i.y = 0 - a.height - 80, t.balloon.addChild(i);
    setTimeout(function() {
        t.balloon.removeChild(i)
    }, 5e3)
}, Room.prototype.removePlayer = function(e) {
    var t = this.playerlist[e.i];
    this.game.removeChild(t), this.balloons.removeChild(t.balloon), this.nicknames.removeChild(t.nickname), delete this.playerlist[e.i]
}, Room.prototype.updateGear = function(e) {
    var t = this.playerlist[e.i];
    t && t.updateGear(e.g)
}, Room.prototype.movePlayer = function(e) {
    var t = this.playerlist[e.i];
    t.isMoving = !0;
    var i = findDirection(e.r);
    t.updateDirection(i), t.updateState("move");
    var r = calculateDistance(t.x, t.y, e.x, e.y) * t.speed;
    t.tween = createjs.Tween.get(t, {
        override: !0
    }).to({
        x: e.x,
        y: e.y
    }, r, createjs.Ease.linear).call(function() {
        if (this.isMoving = !1, t.updateState("stand"), t.nickname.x = t.x, t.nickname.y = t.y, t.balloon.x = t.x, t.balloon.y = t.y, t.isLocal) {
            var e = {
                x: t.x,
                y: t.y
            };
            console.log("look", e), socket.emit("trigger", {
                x: t.x,
                y: t.y
            })
        }
    }).addEventListener("change", function() {
        t.nickname.x = t.x, t.nickname.y = t.y, t.balloon.x = t.x, t.balloon.y = t.y
    })
};
var EventEmitter = function() {
    this.events = {}
};
EventEmitter.prototype.on = function(e, t) {
    "object" != typeof this.events[e] && (this.events[e] = []), this.events[e].push(t)
}, EventEmitter.prototype.removeListener = function(e, t) {
    var i;
    "object" == typeof this.events[e] && -1 < (i = indexOf(this.events[e], t)) && this.events[e].splice(i, 1)
}, EventEmitter.prototype.emit = function(e) {
    var t, i, r, a = [].slice.call(arguments, 1);
    if ("object" == typeof this.events[e])
        for (r = (i = this.events[e].slice()).length, t = 0; t < r; t++) i[t].apply(this, a)
}, EventEmitter.prototype.once = function(t, i) {
    this.on(t, function e() {
        this.removeListener(t, e), i.apply(this, arguments)
    })
};
var artwork = {};

function calculateDistance(e, t, i, r) {
    var a = i - e,
        s = r - t;
    return Math.sqrt(a * a + s * s)
}

function calculateAngle(e, t, i, r) {
    var a = i - e,
        s = t - r,
        o = Math.atan2(a, s),
        n = Math.floor(180 * o / Math.PI);
    return n < 0 ? n + 360 : n
}

function findDirection(e) {
    var t = Math.floor((e + 22.5) / 45);
    return 7 < t ? 0 : t
}

function CritterContainer(e) {
    createjs.MovieClip.call(this);
    var t = critterData[e];
    this.state = "stand", this.isMoving = !1, this.isForward = !0, this.currentDirection = 4, this.framerate = 30, this.loop = -1, this.regX = 68, this.regY = 140;
    var i = new createjs.SpriteSheet(t);
    this.bodyContainer = new createjs.Container, this.feetContainer = new createjs.Container, this.baseContainer = new createjs.Container, this.addChild(this.baseContainer, this.feetContainer, this.bodyContainer), this.skin = new createjs.Container, this.face = new createjs.Container, this.feet = new createjs.Container, this.skin.sprite = new createjs.Sprite(i, "body4"), this.skin.addChild(this.skin.sprite), this.face.sprite = new createjs.Sprite(i, "smile4"), this.face.addChild(this.face.sprite), this.feet.sprite = new createjs.Sprite(i, "feet"), this.feetContainer.addChild(this.feet.sprite), this.slots = {
        eyes: new createjs.Container,
        ears: new createjs.Container,
        head: new createjs.Container,
        belt: new createjs.Container,
        body: new createjs.Container,
        pack: new createjs.Container,
        back: new createjs.Container
    }, this.forward = [this.slots.pack, this.slots.back, this.skin, this.face, this.slots.body, this.slots.belt, this.slots.head, this.slots.ears, this.slots.eyes], this.backward = [this.slots.back, this.slots.eyes, this.skin, this.face, this.slots.belt, this.slots.body, this.slots.head, this.slots.ears, this.slots.pack];
    for (var r = 0; r < this.forward.length; r++) this.bodyContainer.addChild(this.forward[r]);
    t.animations.shadow && (this.baseContainer.sprite = new createjs.Sprite(i, "shadow"), this.baseContainer.addChild(this.baseContainer.sprite)), this.timeline.addTween(createjs.Tween.get(this.bodyContainer).wait(1).to({
        y: 4
    }).wait(1).to({
        y: -12
    }).wait(1).to({
        y: -16
    }).wait(1).to({
        y: -8
    }).wait(1)), this.timeline.addTween(createjs.Tween.get(this.feetContainer).wait(2).to({
        y: -8
    }).wait(1).to({
        y: -16
    }).wait(1).to({
        y: -6
    }).wait(1)), this.timeline.addTween(createjs.Tween.get(this.baseContainer)), this.updateDirection(), this.stop()
}

function ItemSprite(e) {
    var t = new createjs.Sprite(itemSS, e + "3");
    return t.name = e, t
}

function ItemContainer(e, t, i) {
    if (createjs.Container.call(this), this.itemId = e, this.isActive = t || !1, this.background = new createjs.Sprite(uxSS, "item"), this.addChild(this.background), t && this.background.gotoAndStop("item-active"), e) {
        var r = new createjs.Bitmap("/media/29-bunny/icons/viking.png");
        r.scaleX = .3, r.scaleY = .3, r.x = 10, r.y = 10, this.addChild(r)
    }
    this.on("click", function() {
        this.isActive ? (this.background.gotoAndStop("item"), this.isActive = !1) : (this.background.gotoAndStop("item-active"), this.isActive = !0), i && i(this.isActive)
    })
}

function MascotContainer(e) {
    createjs.MovieClip.call(this), this.scaleX = 1, this.scaleY = 1, this.framerate = 30, this.loop = -1, this.currentDirection, this.directionFrames = [0, 1, 3, 3, 4, 5, 5, 7];
    var t = new createjs.SpriteSheet(e);
    this.sprite = new createjs.Sprite(t, "body4"), this.addChild(this.sprite), this.stop()
}

function PlayerContainer(e, t) {
    createjs.Container.call(this), this.playerId = e.i, this.isLocal = !1, this.critterId = e.c, this.isMoving = !1, this.nickname, this.balloon, this.direction = 0, this.animation = "none", this.speed = 5, "RocketSnail" == e.n ? this.critter = new MascotContainer(mascotData.snail) : this.critter = new CritterContainer(this.critterId), this.critter.scaleX = .5, this.critter.scaleY = .5, e.g && this.updateGear(e.g), this.addChild(this.critter)
}

function InventoryScreen(e) {
    createjs.Container.call(this), this.player = e, this.name = "inventory", this.background = new createjs.Shape(art.background), this.background.alpha = .6, this.background.on("click", function() {}), this.addChild(this.background), this.hasChanged = !1, this.handleOpen, this.handleClose;
    var t = new Button("close");
    t.click(function() {
        console.log(this.parent)
    }), t.x = 750, t.y = 50, t.click(function() {
        this.parent.close()
    }), this.addChild(t), this.critter = new CritterContainer("hamster"), this.critter.x = 700, this.critter.y = 300, this.critter.updateGear(e.gear), this.addChild(this.critter), this.grid = new createjs.Container, this.grid.x = 20, this.grid.y = 40, this.addChild(this.grid), this.showIcons()
}
artwork.crosshair = new createjs.Shape, artwork.crosshair.graphics.setStrokeStyle(1).beginStroke("black").moveTo(-10, 0).lineTo(10, 0).moveTo(0, -10).lineTo(0, 10), CritterContainer.prototype = Object.create(createjs.MovieClip.prototype), CritterContainer.prototype.addItem = function(e, t) {
    if ("pack" == e) this.removeItem("pack"), this.removeItem("belt"), this.slots.pack.addChild(new ItemSprite(t + "_BACK")), this.slots.belt.addChild(new ItemSprite(t)), this.updateDirection();
    else if ("ears" == e) this.removeItem("ears"), this.removeItem("back"), this.slots.ears.addChild(new ItemSprite(t)), this.slots.back.addChild(new ItemSprite(t + "_BACK")), this.updateDirection();
    else {
        var i = this.slots[e];
        i && (this.removeItem(e), i.addChild(new ItemSprite(t)), this.updateDirection())
    }
}, CritterContainer.prototype.removeItem = function(e) {
    "pack" == e ? (this.slots.pack.removeAllChildren(), this.slots.belt.removeAllChildren()) : "ears" == e ? (this.slots.ears.removeAllChildren(), this.slots.back.removeAllChildren()) : this.slots[e].removeAllChildren()
}, CritterContainer.prototype.updateGear = function(e) {
    for (var t in this.slots) this.removeItem(t);
    for (var t in e) this.addItem(t, e[t])
}, CritterContainer.prototype.updateDirection = function(e) {
    for (var t in void 0 === e && (e = this.currentDirection), 1 < e && e < 7 ? (this.isForward || (this.isForward = !0, this.updateDepth()), this.face.sprite.gotoAndStop("smile" + e), this.face.visible = !0) : (this.isForward && (this.isForward = !1, this.updateDepth()), this.face.visible = !1), this.slots) {
        var i = this.slots[t];
        if (i.children[0]) {
            var r = i.children[0],
                a = r.name + e;
            itemData.animations[a] ? (r.gotoAndStop(a), i.visible = !0) : i.visible = !1
        }
    }
    this.skin.sprite.gotoAndStop("body" + e), this.currentDirection = e
}, CritterContainer.prototype.updateDepth = function() {
    if (this.isForward) var e = this.forward;
    else e = this.backward;
    for (var t = 0; t < e.length; t++) {
        var i = e[t];
        this.bodyContainer.setChildIndex(i, t)
    }
}, CritterContainer.prototype.updateState = function(e) {
    "move" == e ? (this.state = e, this.gotoAndPlay(0)) : (this.state = e, this.gotoAndStop(0))
}, ItemContainer.prototype = Object.create(createjs.Container.prototype), MascotContainer.prototype = Object.create(createjs.MovieClip.prototype), MascotContainer.prototype.updateDirection = function(e) {
    void 0 === e ? e = this.currentDirection : this.currentDirection = e;
    var t = this.directionFrames[e];
    null != t && this.sprite.gotoAndStop("body" + t)
}, MascotContainer.prototype.addItem = function() {}, MascotContainer.prototype.removeItem = function() {}, MascotContainer.prototype.updateGear = function() {}, MascotContainer.prototype.updateState = function(e) {
    "move" == e ? this.sprite.gotoAndPlay("body" + this.currentDirection) : this.updateDirection()
}, PlayerContainer.prototype = Object.create(createjs.Container.prototype), PlayerContainer.prototype.updateDirection = function(e) {
    this.direction = e, this.critter.updateDirection(e)
}, PlayerContainer.prototype.updateRotation = function(e) {
    this.character.rotation = e
}, PlayerContainer.prototype.updateState = function(e) {
    this.critter.updateState(e)
}, PlayerContainer.prototype.updateGear = function(e) {
    this.critter.updateGear(e)
}, InventoryScreen.prototype = Object.create(createjs.Container.prototype), InventoryScreen.prototype.close = function() {
    socket.emit("updateGear", this.player.gear), this.visible = !1
}, InventoryScreen.prototype.hide = function() {
    this.visible = !1
}, InventoryScreen.prototype.show = function() {
    this.showIcons(), this.visible = !0
}, InventoryScreen.prototype.showIcons = function() {
    this.grid.removeAllChildren();
    var e = this,
        t = this.critter,
        i = this.player;
    this.icons = [];
    for (var r = 0; r < i.inventory.length; r++) {
        var a = i.inventory[r];
        (n = new ItemIcon(a.itemId, a.slot)).click(function() {
            this.isActive ? (t.removeItem(this.slotId), i.removeItem(this.slotId)) : (t.addItem(this.slotId, this.itemId), i.addItem(this.itemId)), e.updateIcons()
        }), this.icons.push(n)
    }
    this.updateIcons();
    var s = 0,
        o = 0;
    for (r = 0; r < this.icons.length; r++) {
        var n;
        (n = this.icons[r]).x = s, n.y = o, this.grid.addChild(n), 500 < (s += 100) && (s = 0, o += 100)
    }
}, InventoryScreen.prototype.updateIcons = function() {
    for (var e = 0; e < this.icons.length; e++) {
        var t = this.icons[e],
            i = this.player.isItemActive(t.itemId);
        t.setActive(i)
    }
};
var art = art || {};
art.background = new createjs.Graphics, art.background.beginFill("black"), art.background.drawRect(0, 0, 850, 480);
var critterData = {
        hamster: {
            images: ["/media/29-bunny/critters/hamster.png"],
            frames: [
                [1, 1, 65, 99, 0, -36, -43],
                [1, 102, 65, 99, 0, -36, -43],
                [1, 102, 65, 99, 0, -36, -43],
                [68, 1, 65, 99, 0, -36, -43],
                [68, 1, 65, 99, 0, -36, -43],
                [68, 102, 65, 99, 0, -36, -43],
                [135, 1, 65, 98, 0, -36, -44],
                [135, 101, 65, 98, 0, -36, -44],
                [1, 203, 60, 23, 0, -38, -129],
                [63, 203, 40, 41, 0, -48, -58],
                [105, 203, 36, 41, 0, -60, -58],
                [105, 203, 36, 41, 0, -60, -58],
                [143, 201, 50, 51, 0, -43, -97],
                [195, 201, 36, 41, 0, -40, -58],
                [195, 201, 36, 41, 0, -40, -58]
            ],
            animations: {
                body1: {
                    frames: [0]
                },
                body2: {
                    frames: [1]
                },
                body3: {
                    frames: [2]
                },
                body5: {
                    frames: [3]
                },
                body6: {
                    frames: [4]
                },
                body7: {
                    frames: [5]
                },
                body0: {
                    frames: [6]
                },
                body4: {
                    frames: [7]
                },
                shadow: {
                    frames: [8]
                },
                smile4: {
                    frames: [9]
                },
                smile2: {
                    frames: [10]
                },
                smile3: {
                    frames: [11]
                },
                feet: {
                    frames: [12]
                },
                smile5: {
                    frames: [13]
                },
                smile6: {
                    frames: [14]
                }
            }
        }
    },
    itemData = {
        framerate: 10,
        frames: [
            [1, 1, 112, 129, 0, -12, -5],
            [1, 132, 112, 128, 0, -12, -1],
            [115, 1, 105, 126, 0, -1, -5],
            [1, 262, 105, 126, 0, -30, -5],
            [115, 129, 90, 126, 0, 0, -2],
            [115, 129, 90, 126, 0, 0, -2],
            [222, 1, 90, 126, 0, -46, -2],
            [222, 1, 90, 126, 0, -46, -2],
            [1, 390, 92, 89, 0, -22, -21],
            [207, 129, 92, 89, 0, -22, -21],
            [314, 1, 92, 89, 0, -22, -21],
            [1, 481, 92, 89, 0, -22, -21],
            [408, 1, 92, 89, 0, -22, -21],
            [502, 1, 92, 89, 0, -22, -21],
            [596, 1, 89, 89, 0, -22, -21],
            [596, 1, 89, 89, 0, -22, -21],
            [687, 1, 89, 89, 0, -25, -21],
            [687, 1, 89, 89, 0, -25, -21],
            [778, 1, 89, 89, 0, -22, -21],
            [778, 1, 89, 89, 0, -22, -21],
            [869, 1, 89, 89, 0, -22, -21],
            [869, 1, 89, 89, 0, -22, -21],
            [1, 572, 85, 61, 0, -24, -18],
            [207, 220, 88, 89, 0, -26, -21],
            [207, 220, 88, 89, 0, -26, -21],
            [314, 92, 88, 89, 0, -26, -21],
            [314, 92, 88, 89, 0, -26, -21],
            [404, 92, 86, 90, 0, -28, -20],
            [492, 92, 86, 90, 0, -22, -20],
            [580, 92, 86, 90, 0, -28, -20],
            [668, 92, 86, 87, 0, -22, -23],
            [756, 92, 86, 87, 0, -28, -23],
            [844, 92, 86, 87, 0, -22, -23],
            [932, 92, 74, 81, 0, -32, -26],
            [932, 92, 74, 81, 0, -32, -26],
            [932, 92, 74, 81, 0, -32, -26],
            [301, 183, 85, 68, 0, -18, -28],
            [297, 253, 85, 68, 0, -33, -29],
            [388, 184, 79, 69, 0, -32, -31],
            [388, 184, 79, 69, 0, -32, -31],
            [469, 184, 76, 77, 0, -31, -31],
            [469, 184, 76, 77, 0, -31, -31],
            [469, 184, 76, 77, 0, -31, -31],
            [469, 184, 76, 77, 0, -31, -31],
            [469, 184, 76, 77, 0, -31, -31],
            [547, 184, 75, 77, 0, -30, -31],
            [547, 184, 75, 77, 0, -30, -31],
            [547, 184, 75, 77, 0, -30, -31],
            [384, 255, 76, 70, 0, -26, -27],
            [462, 263, 82, 56, 0, -27, -19],
            [546, 263, 78, 59, 0, -29, -49],
            [624, 184, 74, 70, 0, -27, -29],
            [700, 181, 74, 81, 0, -30, -26],
            [700, 181, 74, 81, 0, -30, -26],
            [700, 181, 74, 81, 0, -30, -26],
            [700, 181, 74, 81, 0, -30, -26],
            [700, 181, 74, 81, 0, -30, -26],
            [776, 181, 68, 67, 0, -36, -31],
            [776, 181, 68, 67, 0, -36, -31],
            [846, 181, 74, 59, 0, -30, -81],
            [846, 181, 74, 59, 0, -30, -81],
            [626, 256, 72, 58, 0, -31, -26],
            [626, 256, 72, 58, 0, -31, -26],
            [700, 264, 74, 57, 0, -30, -49],
            [700, 264, 74, 57, 0, -30, -49],
            [776, 250, 71, 60, 0, -31, -27],
            [849, 242, 71, 60, 0, -34, -27],
            [960, 1, 61, 45, 0, -37, -33],
            [960, 48, 62, 40, 0, -37, -37],
            [626, 316, 72, 52, 0, -32, -88],
            [700, 323, 78, 47, 0, -29, -49],
            [700, 323, 78, 47, 0, -29, -49],
            [700, 323, 78, 47, 0, -29, -49],
            [780, 312, 74, 59, 0, -32, -81],
            [780, 312, 74, 59, 0, -32, -81],
            [856, 304, 71, 59, 0, -31, -28],
            [462, 321, 78, 40, 0, -27, -89],
            [462, 321, 78, 40, 0, -27, -89],
            [542, 324, 78, 41, 0, -29, -89],
            [115, 257, 78, 40, 0, -31, -89],
            [115, 257, 78, 40, 0, -31, -89],
            [108, 299, 77, 55, 0, -31, -21],
            [108, 299, 77, 55, 0, -31, -21],
            [108, 356, 77, 54, 0, -29, -22],
            [95, 412, 77, 55, 0, -28, -21],
            [95, 412, 77, 55, 0, -28, -21],
            [95, 469, 77, 54, 0, -30, -22],
            [95, 525, 73, 51, 0, -31, -89],
            [88, 578, 72, 55, 0, -32, -85],
            [187, 311, 71, 59, 0, -34, -28],
            [187, 372, 73, 51, 0, -32, -89],
            [174, 425, 71, 59, 0, -31, -28],
            [174, 486, 71, 58, 0, -32, -29],
            [170, 546, 72, 56, 0, -31, -28],
            [170, 546, 72, 56, 0, -31, -28],
            [162, 604, 73, 26, 0, -33, -63],
            [162, 604, 73, 26, 0, -33, -63],
            [260, 323, 69, 47, 0, -37, -49],
            [262, 372, 69, 57, 0, -37, -49],
            [262, 372, 69, 57, 0, -37, -49],
            [247, 431, 71, 59, 0, -34, -28],
            [247, 492, 71, 53, 0, -33, -28],
            [244, 547, 72, 56, 0, -31, -28],
            [244, 547, 72, 56, 0, -31, -28],
            [237, 605, 73, 26, 0, -30, -63],
            [237, 605, 73, 26, 0, -30, -63],
            [932, 175, 73, 26, 0, -33, -63],
            [932, 175, 73, 26, 0, -33, -63],
            [922, 203, 71, 59, 0, -32, -28],
            [922, 264, 62, 37, 0, -37, -37],
            [929, 303, 71, 58, 0, -32, -29],
            [856, 365, 73, 26, 0, -30, -63],
            [856, 365, 73, 26, 0, -30, -63],
            [931, 363, 69, 46, 0, -34, -41],
            [931, 363, 69, 46, 0, -34, -41],
            [931, 363, 69, 46, 0, -34, -41],
            [331, 323, 29, 43, 0, -27, -63],
            [362, 327, 71, 56, 0, -34, -28],
            [362, 327, 71, 56, 0, -34, -28],
            [333, 385, 71, 53, 0, -33, -28],
            [320, 440, 71, 58, 0, -34, -26],
            [320, 440, 71, 58, 0, -34, -26],
            [320, 500, 71, 56, 0, -34, -28],
            [320, 500, 71, 56, 0, -34, -28],
            [318, 558, 71, 55, 0, -33, -26],
            [406, 385, 69, 56, 0, -30, -49],
            [393, 443, 67, 56, 0, -35, -23],
            [393, 501, 66, 57, 0, -35, -22],
            [391, 560, 69, 53, 0, -34, -89],
            [477, 363, 61, 45, 0, -38, -33],
            [540, 367, 69, 46, 0, -33, -41],
            [540, 367, 69, 46, 0, -33, -41],
            [540, 367, 69, 46, 0, -33, -41],
            [540, 367, 69, 46, 0, -33, -41],
            [540, 367, 69, 46, 0, -33, -41],
            [611, 370, 69, 53, 0, -34, -89],
            [682, 372, 69, 53, 0, -34, -89],
            [682, 372, 69, 53, 0, -34, -89],
            [753, 373, 69, 53, 0, -34, -89],
            [477, 410, 60, 26, 0, -38, -63],
            [539, 415, 69, 53, 0, -34, -89],
            [539, 415, 69, 53, 0, -34, -89],
            [610, 425, 69, 53, 0, -34, -89],
            [681, 427, 69, 53, 0, -34, -21],
            [752, 428, 66, 56, 0, -34, -20],
            [752, 428, 66, 56, 0, -34, -20],
            [477, 438, 60, 26, 0, -38, -63],
            [462, 466, 68, 46, 0, -34, -94],
            [461, 514, 62, 43, 0, -36, -33],
            [461, 514, 62, 43, 0, -36, -33],
            [462, 559, 66, 56, 0, -36, -20],
            [462, 559, 66, 56, 0, -36, -20],
            [532, 470, 68, 46, 0, -34, -94],
            [602, 480, 68, 46, 0, -34, -94],
            [602, 480, 68, 46, 0, -34, -94],
            [672, 482, 68, 46, 0, -34, -94],
            [742, 486, 68, 46, 0, -34, -94],
            [742, 486, 68, 46, 0, -34, -94],
            [530, 518, 66, 57, 0, -35, -22],
            [598, 528, 68, 46, 0, -34, -94],
            [668, 530, 65, 51, 0, -36, -89],
            [735, 534, 65, 51, 0, -36, -89],
            [530, 577, 65, 50, 0, -36, -90],
            [530, 577, 65, 50, 0, -36, -90],
            [597, 587, 65, 51, 0, -36, -89],
            [664, 587, 65, 51, 0, -36, -89],
            [731, 587, 54, 51, 0, -57, -19],
            [731, 587, 54, 51, 0, -57, -19],
            [787, 587, 54, 51, 0, -25, -19],
            [787, 587, 54, 51, 0, -25, -19],
            [802, 534, 51, 51, 0, -53, -18],
            [843, 587, 52, 51, 0, -32, -18],
            [812, 486, 65, 46, 0, -36, -94],
            [855, 534, 65, 50, 0, -36, -90],
            [855, 534, 65, 50, 0, -36, -90],
            [897, 586, 51, 48, 0, -27, -22],
            [824, 373, 29, 38, 0, -80, -63],
            [824, 373, 29, 38, 0, -80, -63],
            [855, 393, 65, 46, 0, -36, -94],
            [820, 441, 62, 43, 0, -38, -33],
            [820, 441, 62, 43, 0, -38, -33],
            [879, 486, 65, 46, 0, -36, -94],
            [879, 486, 65, 46, 0, -36, -94],
            [922, 411, 65, 46, 0, -36, -94],
            [922, 534, 51, 48, 0, -58, -22],
            [824, 413, 29, 24, 0, -74, -63],
            [950, 584, 65, 46, 0, -36, -94],
            [950, 584, 65, 46, 0, -36, -94],
            [946, 459, 65, 46, 0, -36, -94],
            [884, 441, 29, 30, 0, -27, -63],
            [884, 441, 29, 30, 0, -27, -63],
            [915, 459, 29, 24, 0, -33, -63],
            [946, 507, 29, 24, 0, -74, -63],
            [977, 507, 29, 24, 0, -33, -63],
            [975, 533, 29, 30, 0, -80, -63]
        ],
        animations: {
            backpack_green_BACK0: {
                frames: [0]
            },
            backpack_green_BACK4: {
                frames: [1]
            },
            backpack_green_BACK1: {
                frames: [2]
            },
            backpack_green_BACK7: {
                frames: [3]
            },
            backpack_green_BACK2: {
                frames: [4]
            },
            backpack_green_BACK3: {
                frames: [5]
            },
            backpack_green_BACK5: {
                frames: [6]
            },
            backpack_green_BACK6: {
                frames: [7]
            },
            bunny_blue0: {
                frames: [8]
            },
            bunny_blue4: {
                frames: [9]
            },
            bunny_pink0: {
                frames: [10]
            },
            bunny_pink4: {
                frames: [11]
            },
            bunny_white0: {
                frames: [12]
            },
            bunny_white4: {
                frames: [13]
            },
            bunny_blue5: {
                frames: [14]
            },
            bunny_blue6: {
                frames: [15]
            },
            bunny_pink2: {
                frames: [16]
            },
            bunny_pink3: {
                frames: [17]
            },
            bunny_pink5: {
                frames: [18]
            },
            bunny_pink6: {
                frames: [19]
            },
            bunny_white5: {
                frames: [20]
            },
            bunny_white6: {
                frames: [21]
            },
            paperhat0: {
                frames: [22]
            },
            bunny_blue2: {
                frames: [23]
            },
            bunny_blue3: {
                frames: [24]
            },
            bunny_white2: {
                frames: [25]
            },
            bunny_white3: {
                frames: [26]
            },
            bunny_blue1: {
                frames: [27]
            },
            bunny_pink7: {
                frames: [28]
            },
            bunny_white1: {
                frames: [29]
            },
            bunny_blue7: {
                frames: [30]
            },
            bunny_pink1: {
                frames: [31]
            },
            bunny_white7: {
                frames: [32]
            },
            easteregg_c0: {
                frames: [33]
            },
            easteregg_c1: {
                frames: [34]
            },
            easteregg_c7: {
                frames: [35]
            },
            sleeping0: {
                frames: [36]
            },
            sleeping4: {
                frames: [37]
            },
            sleeping2: {
                frames: [38]
            },
            sleeping3: {
                frames: [39]
            },
            easteregg_a2: {
                frames: [40]
            },
            easteregg_a3: {
                frames: [41]
            },
            easteregg_a4: {
                frames: [42]
            },
            easteregg_a5: {
                frames: [43]
            },
            easteregg_a6: {
                frames: [44]
            },
            easteregg_a0: {
                frames: [45]
            },
            easteregg_a1: {
                frames: [46]
            },
            easteregg_a7: {
                frames: [47]
            },
            sleeping7: {
                frames: [48]
            },
            paperhat4: {
                frames: [49]
            },
            headphones_white4: {
                frames: [50]
            },
            sleeping1: {
                frames: [51]
            },
            easteregg_c2: {
                frames: [52]
            },
            easteregg_c3: {
                frames: [53]
            },
            easteregg_c4: {
                frames: [54]
            },
            easteregg_c5: {
                frames: [55]
            },
            easteregg_c6: {
                frames: [56]
            },
            sleeping5: {
                frames: [57]
            },
            sleeping6: {
                frames: [58]
            },
            hoodie_blue2: {
                frames: [59]
            },
            hoodie_blue3: {
                frames: [60]
            },
            toque_white2: {
                frames: [61]
            },
            toque_white3: {
                frames: [62]
            },
            headphones_white2: {
                frames: [63]
            },
            headphones_white3: {
                frames: [64]
            },
            toque_white1: {
                frames: [65]
            },
            toque_white7: {
                frames: [66]
            },
            propeller1: {
                frames: [67]
            },
            propeller0: {
                frames: [68]
            },
            hoodie_blue0: {
                frames: [69]
            },
            headphones_white0: {
                frames: [70]
            },
            headphones_white_BACK0: {
                frames: [71]
            },
            headphones_white_BACK4: {
                frames: [72]
            },
            hoodie_blue5: {
                frames: [73]
            },
            hoodie_blue6: {
                frames: [74]
            },
            toque_blue1: {
                frames: [75]
            },
            backpack_green2: {
                frames: [76]
            },
            backpack_green3: {
                frames: [77]
            },
            backpack_green4: {
                frames: [78]
            },
            backpack_green5: {
                frames: [79]
            },
            backpack_green6: {
                frames: [80]
            },
            paperhat2: {
                frames: [81]
            },
            paperhat3: {
                frames: [82]
            },
            paperhat1: {
                frames: [83]
            },
            paperhat5: {
                frames: [84]
            },
            paperhat6: {
                frames: [85]
            },
            paperhat7: {
                frames: [86]
            },
            hoodie_blue1: {
                frames: [87]
            },
            hoodie_blue4: {
                frames: [88]
            },
            toque_blue7: {
                frames: [89]
            },
            hoodie_blue7: {
                frames: [90]
            },
            toque_pink1: {
                frames: [91]
            },
            toque_blue0: {
                frames: [92]
            },
            toque_blue2: {
                frames: [93]
            },
            toque_blue3: {
                frames: [94]
            },
            "3d_black2": {
                frames: [95]
            },
            "3d_black3": {
                frames: [96]
            },
            headphones_white1: {
                frames: [97]
            },
            headphones_white5: {
                frames: [98]
            },
            headphones_white6: {
                frames: [99]
            },
            toque_pink7: {
                frames: [100]
            },
            toque_blue4: {
                frames: [101]
            },
            toque_pink2: {
                frames: [102]
            },
            toque_pink3: {
                frames: [103]
            },
            "3d_black5": {
                frames: [104]
            },
            "3d_black6": {
                frames: [105]
            },
            "3d_white2": {
                frames: [106]
            },
            "3d_white3": {
                frames: [107]
            },
            toque_white0: {
                frames: [108]
            },
            propeller4: {
                frames: [109]
            },
            toque_pink0: {
                frames: [110]
            },
            "3d_white5": {
                frames: [111]
            },
            "3d_white6": {
                frames: [112]
            },
            easteregg_b0: {
                frames: [113]
            },
            easteregg_b1: {
                frames: [114]
            },
            easteregg_b7: {
                frames: [115]
            },
            headphones_white_BACK1: {
                frames: [116]
            },
            toque_blue5: {
                frames: [117]
            },
            toque_blue6: {
                frames: [118]
            },
            toque_pink4: {
                frames: [119]
            },
            toque_white5: {
                frames: [120]
            },
            toque_white6: {
                frames: [121]
            },
            toque_pink5: {
                frames: [122]
            },
            toque_pink6: {
                frames: [123]
            },
            toque_white4: {
                frames: [124]
            },
            headphones_white7: {
                frames: [125]
            },
            viking0: {
                frames: [126]
            },
            viking1: {
                frames: [127]
            },
            pirate_capt_black0: {
                frames: [128]
            },
            propeller7: {
                frames: [129]
            },
            easteregg_b2: {
                frames: [130]
            },
            easteregg_b3: {
                frames: [131]
            },
            easteregg_b4: {
                frames: [132]
            },
            easteregg_b5: {
                frames: [133]
            },
            easteregg_b6: {
                frames: [134]
            },
            pirate_capt_black1: {
                frames: [135]
            },
            pirate_capt_black2: {
                frames: [136]
            },
            pirate_capt_black3: {
                frames: [137]
            },
            pirate_capt_black4: {
                frames: [138]
            },
            "3d_black4": {
                frames: [139]
            },
            pirate_capt_black5: {
                frames: [140]
            },
            pirate_capt_black6: {
                frames: [141]
            },
            pirate_capt_black7: {
                frames: [142]
            },
            viking4: {
                frames: [143]
            },
            viking2: {
                frames: [144]
            },
            viking3: {
                frames: [145]
            },
            "3d_white4": {
                frames: [146]
            },
            plaid_red0: {
                frames: [147]
            },
            propeller2: {
                frames: [148]
            },
            propeller3: {
                frames: [149]
            },
            viking5: {
                frames: [150]
            },
            viking6: {
                frames: [151]
            },
            plaid_red1: {
                frames: [152]
            },
            plaid_red2: {
                frames: [153]
            },
            plaid_red3: {
                frames: [154]
            },
            plaid_red4: {
                frames: [155]
            },
            plaid_red5: {
                frames: [156]
            },
            plaid_red6: {
                frames: [157]
            },
            viking7: {
                frames: [158]
            },
            plaid_red7: {
                frames: [159]
            },
            space_red0: {
                frames: [160]
            },
            space_red1: {
                frames: [161]
            },
            space_red2: {
                frames: [162]
            },
            space_red3: {
                frames: [163]
            },
            space_red4: {
                frames: [164]
            },
            space_red7: {
                frames: [165]
            },
            party_green2: {
                frames: [166]
            },
            party_green3: {
                frames: [167]
            },
            party_green5: {
                frames: [168]
            },
            party_green6: {
                frames: [169]
            },
            party_green1: {
                frames: [170]
            },
            party_green7: {
                frames: [171]
            },
            tshirt_white0: {
                frames: [172]
            },
            space_red5: {
                frames: [173]
            },
            space_red6: {
                frames: [174]
            },
            party_green0: {
                frames: [175]
            },
            headphones_white_BACK2: {
                frames: [176]
            },
            headphones_white_BACK3: {
                frames: [177]
            },
            tshirt_white1: {
                frames: [178]
            },
            propeller5: {
                frames: [179]
            },
            propeller6: {
                frames: [180]
            },
            tshirt_white2: {
                frames: [181]
            },
            tshirt_white3: {
                frames: [182]
            },
            tshirt_white4: {
                frames: [183]
            },
            party_green4: {
                frames: [184]
            },
            "3d_black1": {
                frames: [185]
            },
            tshirt_white5: {
                frames: [186]
            },
            tshirt_white6: {
                frames: [187]
            },
            tshirt_white7: {
                frames: [188]
            },
            headphones_white_BACK5: {
                frames: [189]
            },
            headphones_white_BACK6: {
                frames: [190]
            },
            "3d_black7": {
                frames: [191]
            },
            "3d_white1": {
                frames: [192]
            },
            "3d_white7": {
                frames: [193]
            },
            headphones_white_BACK7: {
                frames: [194]
            }
        },
        images: ["/media/29-bunny/items/items.png"]
    },
    itemSS = new createjs.SpriteSheet(itemData),
    mascotData = {
        snail: {
            critterId: "snail",
            images: ["/media/29-bunny/critters/snail.png"],
            type: "sprite",
            framerate: 10,
            frames: [
                [1, 1, 83, 103, 0, 38, 98],
                [86, 1, 83, 103, 0, 44, 98],
                [171, 1, 81, 105, 0, 38, 100],
                [254, 1, 83, 105, 0, 34, 97],
                [339, 1, 83, 105, 0, 46, 97],
                [424, 1, 81, 105, 0, 43, 100],
                [1, 106, 81, 106, 0, 34, 97],
                [84, 106, 81, 106, 0, 48, 97],
                [167, 108, 55, 110, 0, 27, 95],
                [224, 108, 55, 111, 0, 27, 100],
                [281, 108, 59, 111, 0, 29, 100],
                [342, 108, 59, 112, 0, 29, 104],
                [403, 108, 105, 113, 0, 40, 106],
                [1, 214, 105, 113, 0, 63, 106],
                [108, 220, 97, 114, 0, 38, 107],
                [207, 221, 97, 114, 0, 59, 106]
            ],
            animations: {
                body1: {
                    frames: [2, 0]
                },
                body7: {
                    frames: [5, 1]
                },
                body3: {
                    frames: [6, 3]
                },
                body5: {
                    frames: [7, 4]
                },
                body0: {
                    frames: [8, 9]
                },
                body4: {
                    frames: [10, 11]
                },
                body2: {
                    frames: [14, 12]
                },
                body6: {
                    frames: [15, 13]
                }
            }
        }
    },
    uxData = {
        images: ["/media/29-bunny/ux/ux.png"],
        frames: [
            [1, 1, 104, 86, 0, 0, 0],
            [107, 1, 84, 84, 0, 0, 0],
            [193, 1, 84, 84, 0, 0, 0],
            [279, 1, 40, 40, 0, 0, 0],
            [279, 43, 40, 40, 0, 0, 0]
        ],
        animations: {
            box: {
                frames: [0]
            },
            item_active: {
                frames: [1]
            },
            item: {
                frames: [2]
            },
            close: {
                frames: [3]
            },
            open_btn: {
                frames: [4]
            }
        }
    },
    uxSS = new createjs.SpriteSheet(uxData);
