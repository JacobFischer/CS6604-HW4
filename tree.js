function GenerateTree(levels, branches) {
    var root = new Node();

    var data = 0;
    function createBranches(parent) {
        for(var i = 0; i < branches; i++) {
            var newNode = new Node(parent);

            if(newNode.level < levels) {
                createBranches(newNode);
            }
            else {
                newNode.data = data;
                data += 3;
            }
        }
    };

    createBranches(root);

    return root;
};

function GetDataForVisJS(rootNode) {
    var visNodes = [];
    var visEdges = [];

    var nodes = [ rootNode ];
    while(nodes.length > 0) {
        var node = nodes.pop();
        visNodes.push({
            id: node.id,
            label: String(node.id),
            level: node.level,
            title: formatInfo(node.getInfo()),
        });

        for(var i = 0; i < node.children.length; i++) {
            var childNode = node.children[i];

            visEdges.push({
                from: node.id,
                to: childNode.id,
            });

            nodes.push(childNode);
        }

        if(node.data !== undefined) {
            var id = node.id + "-data";
            visNodes.push({
                id: id,
                label: String(node.data),
                level: node.level+1,
                shape: "box",
                color: "#333",
                font: { color: "#fff" },
                //title: formatInfo(node.getInfo()),
            });

            visEdges.push({
                to: id,
                from: node.id,
                color: "#555",
            });
        }
    }

    return {
        nodes: visNodes,
        edges: visEdges,
    };
};
