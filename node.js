var levelCount = {};

function Node(parentNode) {
    this.parent = parentNode;
    this.children = []; // all the immediate children
    this._subChildren = {}; // all of this node's children, and their children, for easy lookup
    this.data = undefined; // a terminal node has data

    this.level = 0;
    this.id = "I";

    if(this.parent) {
        this.level = this.parent.level + 1;
        if(levelCount.hasOwnProperty(this.level)) {
            levelCount[this.level]++;
        }
        else {
            levelCount[this.level] = 1;
        }
        this.id = AsLetter(this.level-1) + levelCount[this.level];
        this.parent._addChild(this);
    }
};

Node.prototype._addChild = function(childNode) {
    this.numberOfChildren++;
    this.children.push(childNode);
    this._addSubChild(childNode);
};

Node.prototype._addSubChild = function(subChildNode) {
    this._subChildren[subChildNode.id] = subChildNode;

    if(this.parent) {
        this.parent._addSubChild(subChildNode);
    }
};

Node.prototype.subNode = function(node) {
    return this._subChildren[node.id];
}

Node.prototype.contains = function(node) {
    return Boolean(this.subNode(node));
};

Node.prototype.getInfo = function() {
    var children = [];
    for(var childID in this.children) {
        if(this.children.hasOwnProperty(childID)) {
            children.push("Node " + childID);
        }
    }
    children.sort();

    return {
        title: "Node " + this.id,
        data: {
            parent: this.parent ? "Node " + this.parent.id : null,
            children: children,
        }
    }
};

// Node helper function
function LeastCommonAncestor(nodeA, nodeB) {
    var parentNode = nodeA;
    while(parentNode) {
        if(parentNode.contains(nodeB)) {
            return parentNode;
        }

        parentNode = parentNode.parent;
    }
};
