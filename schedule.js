function Schedule(rootNode) {
    this._rootNode = rootNode;
    this.schedules = [];
    this._scheduled = {};
    this._dataLookup = {};

    for(var a = 0; a < rootNode.children.length; a++) {
        this.currentSchedule = [];
        var lastSchedule = this.schedules[a-1];

        this.schedules.push(this.currentSchedule);
        var nodeA = rootNode.children[a];

        this.schedule(rootNode);

        if(lastSchedule) {
            lastSchedule.last().next = this.currentSchedule[0];
        }

        for(var b = 0; b < nodeA.children.length; b++) {
            this.schedule(nodeA); // partial replication

            // if we wanted more than 1 level of replication we'd need another recursive function

            var values = []; // nodes with values
            this.walk(nodeA.children[b], values);

            for(var v = 0; v < values.length; v++) {
                var value = values[v];
                this._dataLookup[value.value] = value.node;
                this.schedule(null, value.value);
            }
        }
    }

    var lastlast = this.schedules.last().last();
    this.schedules[0][0].prev = lastlast;
    lastlast.next = this.schedules[0][0];

    for(var i = 0; i < this.schedules.length; i++) {
        var schedule = this.schedules[i];
        for(var j = 0; j < schedule.length; j++) {
            var item = schedule[j];
            if(item.node && this._scheduled[item.node.id] === 1) {
                item.title = item.node.id;
            }
        }
    }
};

Schedule.prototype.setNext = function(scheduled) {
    this.next = scheduled;
};


Schedule.prototype.schedule = function(node, data) {
    var count;
    if(node) {
        this._scheduled[node.id] = this._scheduled[node.id] || 0;
        count = "" + ++this._scheduled[node.id];
    }

    var prev = this.currentSchedule.last();
    this.currentSchedule.push({
        title: (count ? node.id + "_" + count : data),
        node: node,
        data: data,
        prev: prev,
    });

    if(prev) {
        prev.next = this.currentSchedule.last(); // the new item
    }
};

Schedule.prototype.walk = function(node, values) {
    this.schedule(node);
    for(var c = 0; c < node.children.length; c++) {
        this.walk(node.children[c], values);
    }

    if(node.data) {
        for(var n = 0; n < node.data.length; n++) {
            values.push({
                node: node,
                value: node.data[n],
            });
        }
    }
};

Schedule.prototype.showPathTo = function(broadcasting, fetchData) {
    var leafNode = this._dataLookup[fetchData];
    console.log(broadcasting.title + " to " + leafNode.id + " for ", fetchData);

    if(!leafNode) {
        print("ERROR! no leaf node to fecth");
        return;
    }

    clearPrint();

    if(broadcasting.data === fetchData) {
        print("Found! It's the same data being broadcast!");
        return;
    }

    // see if it is going to be broadcast...
    var looper = 1000;
    var right = broadcasting;
    var willBeRight = true;
    while(right.data !== fetchData) {
        right = right.next;
        if(right.node === this._rootNode) { // we wrapped around, it's not going to be
            willBeRight = false;
            break;
        }
    }

    var node = leafNode;
    var path = [];
    var onPath = false;
    while(node && node !== this._rootNode) {
        path.unshift(node);

        if(node === broadcasting.node) {
            onPath = true;
            break;
        }

        node = node.parent;
    }

    if(!onPath || !willBeRight) {
        var looper = 1000;
        var s = broadcasting;
        while(--looper && s.node !== this._rootNode) {
            if(!s.next) {
                debugger;
            }

            s = s.next;
        }

        if(looper === 0) {
            return print("ERROR: max looper");
        }

        $("#scheduled-" + s.title).addClass("onpath");
        print("Direct the client to the index bucket at " + s.title);
    }

    for(var i = 0; i < path.length; i++) {
        var id = path[i].id;
        if(id[0] === "A") {
            if(broadcasting.node === path[i] && willBeRight) {
                id = broadcasting.title;
            }
            else {
                id += "_1";
            }
        }
        $("#scheduled-" + id).addClass("onpath");
        print("Client should probe " + id + ".");
    }


    $("#bucket-" + fetchData).addClass("onpath");
    print("Client got bucket " + fetchData);
};
