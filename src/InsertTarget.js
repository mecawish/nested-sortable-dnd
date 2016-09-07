import React from "react";
import {DropTarget} from "react-dnd";
import Styles from "./Styles";

export const TYPE = 'TreeNode';

var targetPosition = props => props.insertBefore ? Styles.insertBeforeTarget : Styles.insertAfterTarget;

var emptyNodeChildren = props => {
  console.log(Styles.emptyNodeChildrenLeft);
  if (props.emptyNodeChildrenPosition === 'Left') {
    return Styles.emptyNodeChildrenLeft;
  } else {
    return Styles.emptyNodeChildrenRight;
  }
};

const TreeViewInsertTarget = (props) =>
  props.connectDropTarget(
    <div
      style={
        Object.assign(
          {},
          props.emptyNodeChildrenPosition ? emptyNodeChildren(props) : targetPosition(props),
          props.canDrop ? Styles.insertTargetCanDrop : {},
          props.isDropping ? Styles.insertTargetDropping : {}
        )
      }
    >
      <div
        className={props.isDropping && props.classNames && props.classNames.insertTargetMarkerDropping }
        style={ props.isDropping && !(props.classNames && props.classNames.insertTargetMarkerDropping) ? Styles.insertTargetMarkerDropping : {} }/>
    </div>
  );

const handleCanDrop = (props, monitor, item) => (
  !(
    props.parentNode === item.parentNode &&
    (
      props.parentChildIndex === item.parentChildIndex ||
      props.parentChildIndex === item.parentChildIndex + 1
    )
  ) && !item.allSourceIDs.contains(props.parentNode ? props.parentNode.id : null)
);

const handleDrop = (props, monitor, component, item) => {
  props.onMoveNode({
    oldParentNode: item.parentNode,
    oldParentChildIndex: item.parentChildIndex,
    oldPrecedingNode: item.precedingNode,
    node: item.node,
    newParentNode: props.parentNode,
    newParentChildIndex: props.parentChildIndex,
    newPrecedingNode: props.precedingNode,
  });

  return {
    parentNode: props.parentNode,
    parentChildIndex: props.parentChildIndex,
  };
};

const nodeTarget = {
  drop: (props, monitor, component) => monitor.didDrop()
    ? undefined // some child already handled drop
    : handleDrop(props, monitor, component, monitor.getItem()),
  canDrop: (props, monitor) => handleCanDrop(props, monitor, monitor.getItem()),
};

const collectNodeDropProps =
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
    isDropping: monitor.isOver({shallow: true}) && monitor.canDrop(),
  });

export const DroppedTarget = DropTarget([TYPE], nodeTarget, collectNodeDropProps);

export const DroppableTreeViewInsertTarget = DroppedTarget(TreeViewInsertTarget);
