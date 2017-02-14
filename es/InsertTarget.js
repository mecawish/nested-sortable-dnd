import React from 'react';
import { DropTarget } from 'react-dnd';
import cx from 'classnames';
export var TYPE = 'TreeNode';

var TreeViewInsertTarget = function TreeViewInsertTarget(_ref) {
  var insertBefore = _ref.insertBefore,
      canDrop = _ref.canDrop,
      isDropping = _ref.isDropping,
      classNames = _ref.classNames;
  return props.connectDropTarget(React.createElement(
    'div',
    {
      className: cx(insertBefore ? classNames.insertBeforeTarget : classNames.insertAfterTarget, canDrop && classNames.insertTargetCanDrop, isDropping && classNames.insertTargetDropping)
    },
    React.createElement('div', {
      className: cx(isDropping && classNames.insertTargetMarkerDropping)
    })
  ));
};

var handleCanDrop = function handleCanDrop(props, monitor, item) {
  return (
    // block dropping if a prosp.node.noDrop === true
    (!props.parentNode || props.parentNode && !props.parentNode.noDrop) &&
    // cannot drop to self
    !(props.parentNode === item.parentNode && (props.parentChildIndex === item.parentChildIndex || props.parentChildIndex === item.parentChildIndex + 1)) &&
    // you cannot drop on self nodes
    !item.allSourceIDs.includes(props.parentNode ? props.parentNode.id : null)
  );
};

var handleDrop = function handleDrop(props, monitor, component, item) {
  props.onMoveNode({
    oldParentNode: item.parentNode,
    oldParentChildIndex: item.parentChildIndex,
    oldPrecedingNode: item.precedingNode,
    node: item.node,
    newParentNode: props.parentNode,
    newParentChildIndex: props.parentChildIndex,
    newPrecedingNode: props.precedingNode
  });

  return {
    parentNode: props.parentNode,
    parentChildIndex: props.parentChildIndex
  };
};

var nodeTarget = {
  drop: function drop(props, monitor, component) {
    return monitor.didDrop() ? undefined : // some child already handled drop
    handleDrop(props, monitor, component, monitor.getItem());
  },
  canDrop: function canDrop(props, monitor) {
    return handleCanDrop(props, monitor, monitor.getItem());
  }
};

var collectNodeDropProps = function collectNodeDropProps(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
    isDropping: monitor.isOver({ shallow: true }) && monitor.canDrop()
  };
};

export var DroppedTarget = DropTarget([TYPE], nodeTarget, collectNodeDropProps);
export var DroppableTreeViewInsertTarget = DroppedTarget(TreeViewInsertTarget);