import { getQuery } from './utils';
import type { NodeDataMap } from '../../core/src/data/data-proxy';

const pageId = getQuery('id');

class Store {
  private readonly data: NodeDataMap | null = null;
  public constructor() {

    if (pageId) {
      const strData = localStorage.getItem(`page-${pageId}`) || '';
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
    localStorage.setItem(`page-${pageId}`, strData);
    console.log('save', strData);
  }
}

export default Store;
