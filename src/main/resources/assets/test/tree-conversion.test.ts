import { convert } from '../src/ts/jgrapht-converter';

// Not used by the below functions, this should really be in a test.
const SAMPLE_INPUT = {
    "creator": "JGraphT JSON Exporter",
    "version": "1",
    "nodes": [
        {
            "id": "Alice",
        },
        {
            "id": "Bob",
        },
        {
            "id": "Carol",
        },
        {
            "id": "Dan",
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
    "children": [
        {
            "id": "Bob",
            "children": [
                {
                    "id": "Dan",
                    "children": []
                },
                {
                    "id": "Carol",
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
