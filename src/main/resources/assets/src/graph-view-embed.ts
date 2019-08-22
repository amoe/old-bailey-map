// import Vue from 'vue';
// import Vuex from 'vuex';
// import { GraphView, GraphViewModule } from 'occubrow-graph-view';

// const GRAPH_DATA = {
//     content: "Root",
//     id: 42,
//     label: "Blah",
//     strength: null,
//     children: []
// }

// function makeProps(graphData) {
//     return {
//         width: 800,
//         height: 800,
//         xMargin: 0,
//         yMargin: 0,
//         depthOffset: 120,
//         textOffset: 22,
//         breadth: 360,
//         graphData: graphData,
//         textContentTemplate: "{{content}}"
//     }
// }

// function doTweak(e) {
//     console.log("I would tweak something");
//     GRAPH_DATA.content = "Something else";

//     GRAPH_DATA.children.push({
//         content: "Leaf",
//         id: 43,
//         label: "Blah3",
//         strength: null,
//         children: []
//     });
// }


// function mountGraphView(graphData) {
//     console.log("inside mountGraphView");

//     Vue.use(Vuex);

//     document.getElementById('tweak').addEventListener('click', doTweak);

//     const props = makeProps(graphData);

//     const store = new Vuex.Store({
//         modules: {
//             graphView: GraphViewModule
//         }
//     });

//     const vueInstance = new Vue({
//         store,
//         render: (h) => h(GraphView, { props })
//     });
//     vueInstance.$mount('#graph-target');
// }



// export {mountGraphView};
