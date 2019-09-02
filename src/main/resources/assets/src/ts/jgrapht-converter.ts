const buckets = require('buckets-js');
const TreeModel = require('tree-model');

// Not used by the below functions, this should really be in a test.
const SAMPLE_INPUT = {
    "creator": "JGraphT JSON Exporter",
    "version": "1",
    "nodes": [
        {
            "id": "Alice"
        },
        {
            "id": "Bob"
        },
        {
            "id": "Carol"
        },
        {
            "id": "Dan"
        }
    ],
    "edges": [
        {
            "id": "1",
            "source": "Alice",
            "target": "Bob"
        },
        {
            "id": "2",
            "source": "Bob",
            "target": "Carol"
        },
        {
            "id": "3",
            "source": "Bob",
            "target": "Dan"
        }
    ]
};

const EXPECTED_OUTPUT = {
    "name": "Alice",
    "children": [
        {
            "name": "Bob",
            "children": [
                { "name": "Dan", "children": [] },
                { "name": "Carol", "children": [] }
            ]
        }
    ]
}



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
