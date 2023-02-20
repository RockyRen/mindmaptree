import MindemapTree from '../../core/src/index';
import Store from './store';
import { getQuery, createGithubLink } from './helper';
import type { MindmapTreeOptions } from '../../core/src/index';

export const initPage = ({
  pageName,
  options,
}: {
  pageName?: string;
  options?: Partial<MindmapTreeOptions>;
}): void => {
  createGithubLink();

  const store = new Store(pageName);

  const data = store.getData() || options?.data;

  const mindmapTree = new MindemapTree({
    container: '#container',
    isDebug: getQuery('debug') === '1',
    scale: parseFloat(getQuery('scale')),
    ...options,
    data,
  });

  mindmapTree.on('data', (data) => {
    store.save(data);
  });
};
