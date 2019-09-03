const buckets = require('buckets-js');
const TreeModel = require('tree-model');

function neighborsOf(graph: any, v: any) {
    const result = [];

    for (let edge of graph.edges) {
        if (edge.source === v) {
            result.push(edge.target);
        }
    }

    return result;
}

export function convert(graph: any, dfsRoot: any) {
    const s = buckets.Stack();
    const currentRoot = buckets.Stack();
    const discovered = buckets.Set();

    // A fake node that makes things easier.
    const TOPLEVEL = { 'name': 'TOPLEVEL', 'children': [] };
    currentRoot.push(TOPLEVEL);
    s.push(dfsRoot);

    while (!s.isEmpty()) {
        const v = s.pop();
        const theRoot = currentRoot.pop();

        if (!discovered.contains(v)) {
            const newNode = {
                name: v,
                children: []
            };
            theRoot.children.push(newNode);

            discovered.add(v);

            for (let w of neighborsOf(graph, v)) {
                s.push(w);
                currentRoot.push(newNode);
            }
        }
    }

    return TOPLEVEL.children[0];
}
