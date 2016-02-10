function Edge(fromNode, toNode) {
    this.from = fromNode.id;
    this.to = toNode.id;

    this.fromNode = fromNode;
    this.toNode = toNode;

    this.fromNode.edges.push(this);
    if(fromNode !== toNode) { // not an edge from and to itself
        this.toNode.edges.push(this);
    }
}
