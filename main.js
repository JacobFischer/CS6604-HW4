// The 'main' function that should start everything

var BRANCHES = parseInt(GetUrlParameter("branches", 3));

var rootNode = GenerateTree(
    parseInt(GetUrlParameter("levels", 3)),
    BRANCHES,
    parseInt(GetUrlParameter("buckets", 3))
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
var schedule = new Schedule(rootNode);
var beingBroadcast = null;
var $fetchValue = null;
var $beingBroadcast = null;

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

    for(var i = 0; i < schedule.schedules.length; i++) {
        var subSchedule = schedule.schedules[i];
        var $tr = $("<tr>").appendTo($table);

        for(var j = 0; j < subSchedule.length; j++) {
            var scheduled = subSchedule[j];

            var title = scheduled.title;
            /*if(scheduled.data !== undefined) {
                while(scheduled && scheduled.data !== undefined) {
                    scheduled = subSchedule[++j];
                }

                scheduled = subSchedule[--j];
                title += " ... " + scheduled.data;
            }*/

            var $td = $("<td>")
                .html(title)
                .attr("id", "scheduled-" + scheduled.title)
                .appendTo($tr);

            (function($td, scheduled) {
                $td.on("click", function() {
                    beingBroadcast = scheduled;
                    $beingBroadcast.val(scheduled.title);
                    var fetchData = parseInt($fetchValue.val());

                    $schedules.addClass("showing")
                    $("td", $schedules).removeClass("onpath");
                    $("#schedules td").removeClass("broadcasting fetching");
                    $(this).addClass("broadcasting");
                    $("#bucket-" + fetchData).addClass("fetching");

                    schedule.showPathTo(beingBroadcast, fetchData);
                });
            })($td, scheduled);

            if(scheduled.node) {
                $td.addClass("index-item");
            }
            else { // data
                $td.addClass("data-item").attr("id", "bucket-" + scheduled.data);
            }
        }
    }
};

$(document).ready(function() {
    $print = $("#print");
    $schedules = $("#schedules");
    $fetchValue = $("#fetch-value");
    $beingBroadcast = $("#being-broadcast");

    $("#clear").on("click", function() {
        beingBroadcast = null;
        $schedules.removeClass("showing");
        $("td.broadcasting, td.fetching").removeClass("fetching broadcasting");
        clearPrint();
    })

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
