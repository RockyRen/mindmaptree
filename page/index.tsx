import MindemapTree from '../core/src/index';
import { getQuery } from './common/utils';
import Store from './common/store';
import './common/common.less';

const store = new Store();

const mindmapTree = new MindemapTree({
  container: '#container',
  isDebug: getQuery('debug') === '1',
  data: store.getData() || undefined,
  scale: parseFloat(getQuery('scale')),
});

mindmapTree.on('data', (data) => {
  store.save(data);
});
