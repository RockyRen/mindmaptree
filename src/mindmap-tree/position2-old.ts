import Node from './node';

// 增删节点时的节点移动
// todo 取个好点的名字
export function translateWhenChange(selection: Node) {
  // 兄弟节点移动，往上递归父节点的兄弟节点移动
  const childDepth = selection.depth + 1;
  let childAreaHeight = 0;

  if (childDepth === 1) {
    return;
  } else if (childDepth === 2) {
    childAreaHeight = 37 + 40;
  } else {
    childAreaHeight = 26.5 + 16;
  }

  const moveHeight = childAreaHeight / 2;

  // todo 这里还有做递归
  if (selection.father?.children) {
    const children = selection.father.children;
    const frontBrother: Node[] = [];
    const backBrother: Node[] = [];
    let isBack = false;

    children.forEach((node) => {
      if (node.direction === selection.direction) {
        if (selection.id === node.id) {
          isBack = true;
        } else if (isBack) {
          backBrother.push(node);
        } else {
          frontBrother.push(node);
        }
      }
    });

    frontBrother.forEach((node) => node.translate({
      y: -moveHeight,
    }));
    backBrother.forEach((node) => node.translate({
      y: moveHeight,
    }))
  }
}