import { IController, GraphDataContainer, TokenTreeNode } from '../types';
import { mountGraphView } from '../graph-view-embed';

interface GraphController extends IController {
    graphData: GraphDataContainer;
};


const graph: ng.IComponentOptions = {
    templateUrl: 'html/components/graph.html',
    bindings: {
    },
    controller: function($http: ng.IHttpService) {
        const $ctrl = this as GraphController;
        console.log("inside controller with values %o", this);

        $ctrl.graphData = {
            isLoaded: false,
            data: null
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
                $ctrl.graphData.isLoaded = true;
                $ctrl.graphData.data = response.data as TokenTreeNode;

                console.log("data updated with %o", $ctrl.graphData);
            }).catch(response => {
                console.log("failure");
            });
        };


        $ctrl.$postLink = function() {
            console.log("inside postlink");
            console.log("view of graphdata inside postlink: ", $ctrl.graphData);
            mountGraphView($ctrl.graphData);
        }
    }
};

export default graph;
