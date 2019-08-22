import { TokenTreeNode } from 'occubrow-graph-view/src/interfaces';

interface IController {
    $onInit?(): void;
    $doCheck?(): void;
    $onChanges?(onChangesObj: ng.IOnChangesObject): void;
    $onDestroy?(): void;
    $postLink?(): void;
}

interface GraphDataContainer {
    isLoaded: boolean;
    data: TokenTreeNode;
}

export { IController, GraphDataContainer, TokenTreeNode };
