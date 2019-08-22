// import { mountGraphView } from '../graph-view-embed';

import { TokenTreeNode } from 'occubrow-graph-view';

interface IController {
    $onInit?(): void;
    $doCheck?(): void;
    $onChanges?(onChangesObj: ng.IOnChangesObject): void;
    $onDestroy?(): void;
    $postLink?(): void;
}

interface GraphDataContainer {
    isLoaded: boolean;
    data: TokenTreeNode | null;
}

interface GraphController extends IController {
    graphData: any;
};

const graph: ng.IComponentOptions = {
    templateUrl: 'html/components/graph.html',
    bindings: {
    },
    controller: function($http: ng.IHttpService) {
        const $ctrl = this as GraphController;
        console.log("inside controller with values %o", this);

        $ctrl.graphData = 42;

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
                $ctrl.graphData.isLoaded = true;
                $ctrl.graphData.data = response.data;
            }).catch(response => {
                console.log("failure");
            });
        };

        $ctrl.$onInit = function() {
            console.log("value of this inside onInit: %o", this);
        };

        // this.$postLink = function() {
        //     console.log("inside postlink");
        //     console.log("view of graphdata inside postlink: ", $ctrl.graphData);
        //     // mountGraphView($ctrl.graphData);
        // };
    }
};

export default graph;
