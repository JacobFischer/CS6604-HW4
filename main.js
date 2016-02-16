var nodes = null;
var edges = null;
var network = null;

var tree = generateTree(30);

var caller = new User("Caller", randomElementFromArray(tree));
var callee = new User("Callee", randomElementFromArray(tree));

var users = [ caller, callee ];

var dataForVisJS;

function updateNetwork(data) {
    if(!data) {
        dataForVisJS = getDataForVisJS(tree, users);
        data = dataForVisJS;
    }

    network.setData(data);
};

function destroy() {
    if (network !== null) {
        network.destroy();
        network = null;
    }
};

var $print;
function print(str) {
    $print.append(
        $("<li>").html(str)
    );
};

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
        physics: {
            //stabilization: false,
        },
    };

    network = new vis.Network(container, {}, options);
    updateNetwork();
};

function clearPopUp() {
    document.getElementById('saveButton').onclick = null;
    document.getElementById('cancelButton').onclick = null;
    document.getElementById('network-popUp').style.display = 'none';
};

function cancelEdit(callback) {
    clearPopUp();
    callback(null);
};

function saveData(data,callback) {
    data.id = document.getElementById('node-id').value;
    data.label = document.getElementById('node-label').value;
    clearPopUp();
    callback(data);
};

$(document).ready(function() {
    $print = $("#print");
    $cost = $("#cost")
    function locate(callback) {
        var cloned = $.extend(true, {}, dataForVisJS);

        $print.html("");
        print("Locating " + caller.id + " @ " + caller.location.id + " to " + callee.id + " @ " + callee.location.id + ".");
        var result = callback(caller, callee, cloned);

        $cost.html("Total cost: " + result.hops + " node hops" +(result.updates ? " + update cost" : "") + ".");

        updateNetwork(cloned);
    };

    $("#homework-controls form").on("submit", function(e) {
        e.preventDefault();
        var $form = $(this);
        var $number = $('input[type="number"]', $form);

        var id = $number.attr("id");
        var user;
        for(var i = 0; i < users.length; i++) {
            users[i];
            if(users[i].id === id) {
                user = users[i];
                break;
            }
        }

        if(!user) {
            alert("Error: could not find the user '" + id +"'.");
            return;
        }

        var newLocationID = parseInt($number.val());
        var newLocation = tree[newLocationID];
        if(!newLocation) {
            alert("Error: invalid new location id '" + newLocationID + "'.");
            return;
        }

        user.location = newLocation;
        $number.val("");
        updateNetwork();
    })

    $("#locate-via-pointer").on("click", function() {
        locate(locateViaPointers);
    })

    $("#locate-via-database").on("click", function() {
        locate(locateViaDatabase);
    })
});
