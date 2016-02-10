nextID = 0;

function Node() {
    this.id = nextID++;
    this.label = String(this.id);

    this.edges = [];
}
