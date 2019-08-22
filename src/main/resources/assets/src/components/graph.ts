import { mountGraphView } from '../graph-view-embed';

const graph = {
    templateUrl: 'html/components/graph.html',
    bindings: {
    },
    controller: function($http: ng.IHttpService) {
        console.log("inside controller");
        const $ctrl = this;

        $ctrl.graphData = {
            isLoaded: false,
            data: null
        };

        this.$onInit = function() {
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

        this.$postLink = function() {
            console.log("inside postlink");
            console.log("view of graphdata inside postlink: ", $ctrl.graphData);
            mountGraphView($ctrl.graphData);
        };
    }
};

export default graph;
