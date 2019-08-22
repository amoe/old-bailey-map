import {mountGraphView} from '../graph-view-embed';

const graph = {
    templateUrl: 'html/components/graph.html',
    bindings: {
    },
    controller: function() {
        console.log("inside controller");
        const $ctrl = this;
        
        this.$postLink = function() {
            console.log("inside postlink");

            mountGraphView();
        };
    }
};

export default graph;
