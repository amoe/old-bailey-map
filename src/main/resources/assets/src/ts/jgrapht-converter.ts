const buckets = require('buckets-js');

function makeAdjacencyList(g: any): any {
    const adj: any = {};

    // initialize node data
    for (let node of g.nodes) {
        adj[node.id] = {
            data: node,
            neighbours: []
        };
    }


    // add edges
    for (let edge of g.edges) {
        const sourceNode = edge.source;

        if (sourceNode in adj) {
            adj[sourceNode].neighbours.push(edge.target);
        } else {
            throw new Error("unrecognized source node");
        }
    }

    return adj;
}



export function convert(graph: any, dfsRoot: any) {
    const s = buckets.Stack();
    const currentRoot = buckets.Stack();
    const discovered = buckets.Set();

    const adjacencyList = makeAdjacencyList(graph);
    console.log("adjacency list is %o", adjacencyList);

    // A fake node that makes things easier.
    const TOPLEVEL = { 'name': 'TOPLEVEL', 'children': [] };
    currentRoot.push(TOPLEVEL);
    s.push(dfsRoot);

    const getNode = function(n: any) {
        if (n in adjacencyList) {
            return adjacencyList[n];
        } else {
            throw new Error("unrecognized node " + n);
        }
    };

    while (!s.isEmpty()) {
        const v = s.pop();
        const theRoot = currentRoot.pop();

        if (!discovered.contains(v)) {
            const theNode = getNode(v);

            const newNode = Object.assign(
                { children: [] },
                theNode.data
            );

            theRoot.children.push(newNode);
            discovered.add(v);

            for (let w of theNode.neighbours) {
                s.push(w);
                currentRoot.push(newNode);
            }
        }
    }

    return TOPLEVEL.children[0];
}
