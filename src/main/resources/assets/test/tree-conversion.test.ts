import { convert } from '../src/ts/jgrapht-converter';

// Not used by the below functions, this should really be in a test.
const SAMPLE_INPUT = {
    "creator": "JGraphT JSON Exporter",
    "version": "1",
    "nodes": [
        {
            "id": "Alice",
            "strength": null,
        },
        {
            "id": "Bob",
            "strength": 1,
        },
        {
            "id": "Carol",
            "strength": 2,
        },
        {
            "id": "Dan",
            "strength": 3,
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
    "id": "Alice",
    "strength": null,
    "children": [
        {
            "id": "Bob",
            "strength": 1,
            "children": [
                {
                    "id": "Dan",
                    "strength": 3,
                    "children": []
                },
                {
                    "id": "Carol",
                    "strength": 2,
                    "children": []
                }
            ]
        }
    ]
}

test('tree conversion', () => {
    const actualOutput = convert(SAMPLE_INPUT, 'Alice');
    expect(actualOutput).toEqual(EXPECTED_OUTPUT);
});
