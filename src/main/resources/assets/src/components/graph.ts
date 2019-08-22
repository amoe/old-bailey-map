import { mountGraphView } from '../graph-view-embed';

const graph = {
    templateUrl: 'html/components/graph.html',
    bindings: {
    },
    controller: function($http: ng.IHttpService) {
        console.log("inside controller");
        const $ctrl = this;


        this.$onInit = function() {
            console.log("inside oninit", $http);
            $http({
                method: 'GET',
                url: '/api/graph'
            }).then(response => {
                console.log("success");
            }).catch(response => {
                console.log("failure");
            });
        };

        this.$postLink = function() {
            console.log("inside postlink");
            mountGraphView();
        };
    }
};

export default graph;
