// This is where we manipulate the Nodes to show the various caller <--> callee locators

function locateViaPointers(caller, callee, originalData) {
    // do LCA to travel upwards from the caller
    var lca = caller;
    while(lca) {
        if(lca.contains(callee) || lca === callee) {
            break;
        }

        if(lca.parent) {
            originalData.edges.push({ // we need to show a red edge over the blue one, so we add it here
                from: lca.id,
                to: lca.parent.id,
                color: "red",
            });

            lca = lca.parent;
        }
    }

    console.log("LCA of " + caller.id + " and " + callee.id + " is " + lca.id + ".");

    // we now found the LCA, so travel down to the callee.
    var downNode = lca;
    var count = 0;
    while(downNode !== callee && ++count < 1000) { // find the node downwards that has the callee (LCA part 2)
        for(var childID in downNode.children) {
            if(downNode.children.hasOwnProperty(childID)) {
                var child = downNode.children[childID];

                if(child.contains(callee) || child === callee) {
                    originalData.edges.push({ // see above
                        from: downNode.id,
                        to: child.id,
                        color: "green",
                    });

                    downNode = child;
                    break;
                }
            }
        }
    }
};

function locateViaDatabase(caller, callee, originalData) {
    var lca = caller;
    while(lca) {
        if(lca.contains(callee) || lca === callee) {
            break;
        }

        if(lca.parent) {
            originalData.edges.push({ // we need to show a red edge over the blue one, so we add it here
                from: lca.id,
                to: lca.parent.id,
                color: "red",
            });

            lca = lca.parent;
        }
    }

    console.log("LCA of " + caller.id + " and " + callee.id + " is " + lca.id + ".");

    // now we are at the LCA, it has the database location saved so go strait there.
    originalData.edges.push({ // see above
        from: lca.id,
        to: callee.id,
        color: "green",
        label: "@ " + callee.id,
    });
};
