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

    // A fake node that makes things easier.
    const TOPLEVEL = { 'name': 'TOPLEVEL', 'children': [] };
    currentRoot.push(TOPLEVEL);
    s.push(dfsRoot);

    while (!s.isEmpty()) {
        const v = s.pop();
        const theRoot = currentRoot.pop();

        if (!discovered.contains(v)) {
            const newNode = Object.assign(
                { children: [] },
                adjacencyList[v].data
            );

            theRoot.children.push(newNode);
            discovered.add(v);

            for (let w of adjacencyList[v].neighbours) {
                s.push(w);
                currentRoot.push(newNode);
            }
        }
    }

    return TOPLEVEL.children[0];
}
