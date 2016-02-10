function generateGraph(nodeCount) {
    var nodes = [];
    var edges = [];
    var connectionCount = [];

    // randomly create some nodes and edges
    for (var i = 0; i < nodeCount; i++) {
        var node = new Node();
        nodes.push(node);

        connectionCount[i] = 0;
        var to = null; // we'll find the connection

        // create edges in a scale-free-network way
        if(i > 0) {
            if (i == 1) {
                to = nodes[0];
            }
            else if (i > 1) {
                var conn = edges.length * 2;
                var rand = Math.floor(Math.random() * conn);
                var cum = 0;
                var j = 0;
                while (j < connectionCount.length && cum < rand) {
                    cum += connectionCount[j];
                    j++;
                }

                to = nodes[j];
            }

            edges.push(new Edge(node, to));

            connectionCount[node.id]++;
            connectionCount[to.id]++;
        }
    }

    return {nodes:nodes, edges:edges};
}