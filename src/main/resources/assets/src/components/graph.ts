import { IController, GraphDataContainer, TokenTreeNode } from '../types';
import { mountGraphView } from '../graph-view-embed';
import { convert } from '../ts/jgrapht-converter';

interface GraphController extends IController {
    graphData: GraphDataContainer;
};


const REAL_DATA: TokenTreeNode = {
    content: "Root",
    id: 42,
    label: "Blah",
    strength: null,
    children: [{
        content: "Leaf",
        id: 43,
        label: "Blah3",
        strength: null,
        children: []
    }]
};

function mutateTree(container: GraphDataContainer, source: TokenTreeNode) {
    container.data.content = source.content;
    container.data.id = source.id;
    container.data.label = source.label;
    container.data.strength = source.strength;
    container.data.children = source.children;
}

const graph: ng.IComponentOptions = {
    templateUrl: 'html/components/graph.html',
    bindings: {
    },
    controller: function($http: ng.IHttpService) {
        const $ctrl = this as GraphController;
        console.log("inside controller with values %o", this);

        $ctrl.graphData = {
            isLoaded: false,
            // A dummy node that should never be shown
            data: {
                content: "",
                id: 0,
                label: "",
                strength: null,
                children: []
            }
        };

        // $ctrl.graphData = {
        //     isLoaded: false,
        //     data: null
        // };

        $ctrl.$onInit = function() {
            console.log("inside oninit", $http);
            $http({
                method: 'GET',
                url: '/api/graph'
            }).then(response => {
                console.log("success");

                const jgraphtData = response.data;
                const converted = convert(jgraphtData, 'Alice');

                console.log("the response was %o", response.data);
                console.log("converted data is %o", converted);

                // Reference finicky-ness here
                mutateTree($ctrl.graphData, converted);
                $ctrl.graphData.isLoaded = true;

                console.log("data updated with %o", $ctrl.graphData);
            }).catch(response => {
                console.log("failure");
            });
        };


        $ctrl.$postLink = function() {
            console.log(convert);
            console.log("inside postlink");
            console.log("view of graphdata inside postlink: ", $ctrl.graphData);
            mountGraphView($ctrl.graphData);
        }
    }
};

export default graph;
