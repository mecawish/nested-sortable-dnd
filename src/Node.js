import cx from "classnames";
import React, {Component} from "react";
import {DragSource} from "react-dnd";
import {TYPE, DroppedTarget, DroppableTreeViewInsertTarget} from "./InsertTarget";
import Styles from "./Styles";

const TreeViewItem = props => (
  props.connectDragSource(
    <div
    className={
      cx(props.classNames.node, {
        [props.classNames.nodeDragging]: props.isDragging,
      }) }
    key={ props.node.id }
    >

    {
      props.node.children && props.node.children.length === 0 ?
        <DroppableTreeViewItemNode
            parentNode={ props.node }
            parentChildIndex={ 0 }
            precedingNode={ null }
            onMoveNode={ props.onMoveNode }
            renderNode={props.renderNode}

            classNames={props.classNames}
         /> :
        <div>
          { props.renderNode(props.node) }
        </div>
    }

    {
      !props.node.isCollapsed &&
        <div className={ props.classNames.nodeChildren }>
          { props.node.children && props.node.children.length > 0
            && <TreeViewItemList
              parentNode={ props.node }
              nodes={ props.node.children ? props.node.children : [] }
              classNames={ props.classNames }
              renderNode={ props.renderNode }
              onMoveNode={ props.onMoveNode }
              />
          }
        </div>
    }
  </div>
  )
);

const DroppableTreeViewItemNode = DroppedTarget(props => props.connectDropTarget(
  <div className={props.classNames && props.isDropping ? props.classNames.insertNodeDropping : null}>
    <div>
      { props.renderNode(props.parentNode) }
    </div>
  </div>
));

// append current node as well as children's node using flatMap
const gatherNodeIDs = node => [node.id, ...[].concat(...(node.children || []).map(gatherNodeIDs))];

const nodeSource = {
  beginDrag: (props, monitor, component) => ({
    node: props.node,
    allSourceIDs: gatherNodeIDs(props.node),
    parentNode: props.parentNode,
    parentChildIndex: props.parentChildIndex,
    precedingNode: props.precedingNode,
  })
};

const collectNodeDragProps = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

export const DraggableTreeViewItem = DragSource(TYPE, nodeSource, collectNodeDragProps)(TreeViewItem);

const DroppableTreeViewItem = DroppedTarget(props => props.connectDropTarget(
  <div className={props.classNames && props.isDropping ? props.classNames.insertNodeDropping : null}>
    <DraggableTreeViewItem {...props.nodeOptions} classNames={props.classNames} onMoveNode={props.onMoveNode} />
  </div>
));

const nodesWithPredecessors = (nodes) => {
  return (
    nodes.map( node => ({node, precedingNode: node}) )
  )
}


// TODO: add a mechanism to apply the CSS equivalent:
// .nodePositioningWrapper:hover {
//   /* otherwise drop targets interfere with drag start */
//   z-index: 2;
// }

export const TreeViewItemList = (props) => {
  const withPredecessors = nodesWithPredecessors(props.nodes);
  return (
    <div className={ props.classNames.nodeList }>
      {
        withPredecessors.map((node, index) =>
          <div
            key={ index }
            style={ {position: "relative"} }
            className={ props.classNames.nodePositioningWrapper }
          >
            {
              index === 0
                ? <DroppableTreeViewInsertTarget
                classNames={props.classNames}
                insertBefore={ true }
                parentNode={ props.parentNode }
                parentChildIndex={ index }
                precedingNode={ null }
                onMoveNode={ props.onMoveNode }
              />
                : null
            }

            <DroppableTreeViewInsertTarget
              classNames={props.classNames}
              insertBefore={ false }
              parentNode={ props.parentNode }
              parentChildIndex={ index + 1 }
              precedingNode={ node.node }
              onMoveNode={ props.onMoveNode }
            />

            <DraggableTreeViewItem
                  parentNode={ props.parentNode }
                  parentChildIndex={ index }
                  precedingNode={ node.precedingNode }
                  node={ node.node }
                  classNames={ props.classNames }
                  renderNode={ props.renderNode }
                  onMoveNode={ props.onMoveNode }
                />
          </div>
        )
      }
    </div>
  );

};
