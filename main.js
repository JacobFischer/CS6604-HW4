// The 'main' function that should start everything

var rootNode = GenerateTree(
    parseInt(GetUrlParameter("levels", 3)),
    parseInt(GetUrlParameter("branches", 3)),
    parseInt(GetUrlParameter("bucket", 3))
);

var network = null;
var dataForVisJS;

function updateNetwork(data) {
    if(!data) {
        dataForVisJS = GetDataForVisJS(rootNode);
        data = dataForVisJS;
    }

    network.setData(data);
};

var $schedules;

function draw() {
    if(network !== null) {
        network.destroy();
        network = null;
    }

    // create a network
    var container = document.getElementById('mynetwork');
    var options = {
        layout: {
            hierarchical: {
                direction: "UD",
                //sortMethod: "directed",
            }
        },
        edges: {
            smooth: {
                type: 'cubicBezier',
                forceDirection: 'vertical',
                roundness: 0.4
            },
            arrows: 'to',
        },
        physics: {
            //stabilization: false,
        },
    };

    network = new vis.Network(container, {}, options);
    updateNetwork();

    $schedules.html("");
    var $table = $("<table>").appendTo($schedules);

    for(var a = 0; a < rootNode.children.length; a++) {
        var nodeA = rootNode.children[a];

        var $tr = $("<tr>")
            .appendTo($table)
            .append($("<td>I_" + (a+1) + "</td>"))
            .append($("<td>" + nodeA.id + "</td>"));

        var walk = function(node, values) {
            $tr.append($("<td>" + node.id + "</td>"));

            for(var c = 0; c < node.children.length; c++) {
                walk(node.children[c], values);
            }

            if(node.data) {
                values.push.apply(values, node.data);
            }
        };

        for(var b = 0; b < nodeA.children.length; b++) {
            var values = [];
            walk(nodeA.children[b], values);

            $tr
                .append($("<td>" + values[0] + "</td>"))
                .append($("<td>...</td>"))
                .append($("<td>" + values.last() + "</td>"));
        }
    }
};

$(document).ready(function() {
    $schedules = $("#schedules");
    draw();

    $selectedInfo = $("#selected-info");
    network
        .on("selectNode", function(e) {
            $selectedInfo.html("");
            if(e && e.nodes && e.nodes[0] !== undefined) {
                var id = e.nodes[0];
                var intID = parseInt(id);

                var obj = (isNaN(intID) ? usersByID[id] : tree[intID]);
                console.log(obj);

                $selectedInfo.html(formatInfo(obj.getInfo()));
            }
        })
        .on("deselectNode", function() {
            $selectedInfo.html("");
        });
});
