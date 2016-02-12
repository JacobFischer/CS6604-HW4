nextID = 0;

function Node(parentNode) {
    this.id = nextID++;

    this.parent = parentNode;
    this.children = {}; // all the immediate children
    this._subChildren = {}; // all of this node's children, and their children, for easy lookup

    this.level = 0;
    if(this.parent) {
        this.level = 1 + this.parent.addChild(this);
    }
};

Node.prototype.addChild = function(childNode) {
    this.children[childNode.id] = childNode;

    return 0 + this.addSubChild(childNode);
};

Node.prototype.addSubChild = function(subChildNode) {
    this._subChildren[subChildNode.id] = subChildNode;

    if(this.parent) {
        return 1 + this.parent.addSubChild(subChildNode);
    }

    return 0;
};

Node.prototype.contains = function(node) {
    return Boolean(this.children[node.id] || this._subChildren[node.id]);
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
