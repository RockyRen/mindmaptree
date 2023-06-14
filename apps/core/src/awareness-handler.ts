import Selection from './selection/selection';
import type { Awareness } from "y-protocols/awareness";
import type Node from './node/node';
import type PaperWrapper from './paper-wrapper';

interface UserSelectItem {
  user: string;
  color: string;
  selectId: string;
}

export const userConfig: { name: string; color: string; }[] = [
  { name: 'Alice', color: '#30bced' },
  { name: 'Bob', color: '#6eeb83' },
  { name: 'Ben', color: '#ffbc42' },
  { name: 'Lily', color: '#ecd444' },
  { name: 'Juicy', color: '#ee6352' },
  { name: 'Nana', color: '#9ac2c9' },
  { name: 'Edwin', color: '#8acb88' },
  { name: 'Jimmy', color: '#1be7ff' },
];

const accessTime = (Number(localStorage.getItem('accessTime')) || 0) + 1;
localStorage.setItem('accessTime', `${accessTime}`);

class AwarenessHandler {
  private userSelectList: UserSelectItem[] = [];
  public constructor(
    awareness: Awareness,
    private readonly selection: Selection,
    private readonly root: Node,
    private readonly paperWrapper: PaperWrapper,
  ) {
    const currentUser = userConfig[accessTime % userConfig.length];
    this.createUserNameDom(currentUser.name);

    awareness.on('change', () => {
      // todo 暂时使用定时器的方式，确保在render后面才设置select样式
      setTimeout(() => {
        const values = Array.from(awareness.getStates().values());
        const userSelectList = values.reduce((list, value) => {
          const user = Object.keys(value)?.[0];
          if (user) {
            const selectId = value[user]?.selectId || '';
            const color = value[user]?.color || '';
            list.push({
              user,
              color,
              selectId,
            });
          }
          return list;
        }, [] as UserSelectItem[]) as UserSelectItem[];

        const nodeMap = this.getNodeMap();

        // 清空旧的style
        this.userSelectList.forEach(({ selectId }) => {
          const node = nodeMap[selectId];
          node?.setCollaborateStyle(null);
        });

        // 设置新的style
        userSelectList.forEach(({ user, selectId, color }) => {
          if (user === currentUser.name) return;
          const node = nodeMap[selectId];
          node?.setCollaborateStyle({
            name: user,
            color,
          });
        });

        this.userSelectList = userSelectList;
      }, 200);
    });

    this.selection.on('select', () => {
      const selectNodes = this.selection.getSelectNodes();
      awareness.setLocalStateField(currentUser.name, {
        selectId: selectNodes[0]?.id || '',
        color: currentUser.color,
        timestamp: Date.now(),
      });
    });
  }

  private getNodeMap = (): Record<string, Node> => {
    const nodeMap: Record<string, Node> = {};
    this.getNodeMapInner(this.root, nodeMap);
    return nodeMap;
  }

  private getNodeMapInner = (node: Node, nodeMap: Record<string, Node>): void => {
    if (!node) return;
    nodeMap[node.id] = node;

    node.children?.forEach((child) => {
      this.getNodeMapInner(child, nodeMap) !== null;
    });
  }

  private createUserNameDom(username: string): void {
    const wrapperDom = this.paperWrapper.getWrapperDom();
    const usernameDom = document.createElement('div');
    usernameDom.style.position = 'fixed';
    usernameDom.style.top = '34px';
    usernameDom.style.left = '30px';
    usernameDom.innerHTML = `user: ${username}`;
    wrapperDom.appendChild(usernameDom)
  }
}

export default AwarenessHandler;
