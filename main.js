var nodes = null;
var edges = null;
var network = null;

var tree = generateTree(25);
var dataForVisJS = getDataForVisJS(tree[0]);

function destroy() {
    if (network !== null) {
        network.destroy();
        network = null;
    }
}

function draw() {
    destroy();

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
        manipulation: {
            addNode: function (data, callback) {
                // filling in the popup DOM elements
                document.getElementById('operation').innerHTML = "Add Node";
                document.getElementById('node-id').value = data.id;
                document.getElementById('node-label').value = data.label;
                document.getElementById('saveButton').onclick = saveData.bind(this, data, callback);
                document.getElementById('cancelButton').onclick = clearPopUp.bind();
                document.getElementById('network-popUp').style.display = 'block';
            },
            editNode: function (data, callback) {
                // filling in the popup DOM elements
                document.getElementById('operation').innerHTML = "Edit Node";
                document.getElementById('node-id').value = data.id;
                document.getElementById('node-label').value = data.label;
                document.getElementById('saveButton').onclick = saveData.bind(this, data, callback);
                document.getElementById('cancelButton').onclick = cancelEdit.bind(this,callback);
                document.getElementById('network-popUp').style.display = 'block';
            },
            addEdge: function (data, callback) {
                if (data.from == data.to) {
                    var r = confirm("Do you want to connect the node to itself?");
                    if (r == true) {
                        callback(data);
                    }
                }
                else {
                    callback(data);
                }
            }
        },
        physics:{
            stabilization: false,
        },
    };

    network = new vis.Network(container, dataForVisJS, options);
}

function clearPopUp() {
    document.getElementById('saveButton').onclick = null;
    document.getElementById('cancelButton').onclick = null;
    document.getElementById('network-popUp').style.display = 'none';
}

function cancelEdit(callback) {
    clearPopUp();
    callback(null);
}

function saveData(data,callback) {
    data.id = document.getElementById('node-id').value;
    data.label = document.getElementById('node-label').value;
    clearPopUp();
    callback(data);
}

$(document).ready(function() {
    function locate(callback) {
        var cloned = $.extend(true, {}, dataForVisJS);
        var caller = tree[$("#caller").val()];
        var callee = tree[$("#callee").val()];

        callback(caller, callee, cloned);

        network.setData(cloned);
    };

    $("#locate-via-pointer").on("click", function() {
        locate(locateViaPointers);
    })

    $("#locate-via-database").on("click", function() {
        locate(locateViaDatabase);
    })
});
