// The 'main' function that should start everything

var rootNode = GenerateTree(parseInt(GetUrlParameter("levels", 3)), parseInt(GetUrlParameter("branches", 3)));

var network = null;
var dataForVisJS;

function updateNetwork(data) {
    if(!data) {
        dataForVisJS = GetDataForVisJS(rootNode);
        data = dataForVisJS;
    }

    network.setData(data);
};

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
};

$(document).ready(function() {
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
