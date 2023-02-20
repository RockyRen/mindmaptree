import { getQuery } from './helper';
import type { NodeDataMap } from '../../core/src/types';

const pageId = getQuery('id');

class Store {
  private readonly data: NodeDataMap | null = null;
  private pageKey: string = 'page';
  public constructor(pageKey?: string) {
    if (pageKey) {
      this.pageKey = pageKey;
    }
    if (pageId) {
      const strData = localStorage.getItem(`${this.pageKey}-${pageId}`) || '';
      if (strData) {
        this.data = JSON.parse(strData);
      }
    }
  }

  public getData(): NodeDataMap | null {
    return this.data;
  }

  public save(data: NodeDataMap): void {
    const strData = JSON.stringify(data);
    localStorage.setItem(`${this.pageKey}-${pageId}`, strData);
    console.log('save', strData);
  }
}

export default Store;
