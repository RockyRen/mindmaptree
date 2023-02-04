import MindemapTree from '../core/src/index';
import { getQuery } from './common/utils';
import Store from './common/store';
import type { NodeDataMap } from '../core/src/data/data-proxy';
import './common/common.less';

const defaultData: NodeDataMap = {
  '1': {
    label: 'My Holiday',
    direction: 0,
    isRoot: true,
    children: ['2', '5', '7'],
  },
  '2': {
    label: 'Morning',
    direction: 1,
    children: ['3', '4'],
  },
  '3': {
    label: 'Read book',
    direction: 1,
    children: [],
  },
  '4': {
    label: 'Cook',
    direction: 1,
    children: [],
  },
  '5': {
    label: 'Afternoon',
    direction: 1,
    children: ['6'],
  },
  '6': {
    label: 'Baseball competition',
    direction: 1,
    children: [],
  },
  '7': {
    label: 'Evening',
    direction: -1,
    children: ['8'],
    isExpand: false,
  },
  '8': {
    label: 'Happy Dinner',
    direction: -1,
    children: []
  },
};

const store = new Store();

const data = store.getData() || defaultData;

const mindmapTree = new MindemapTree({
  container: '#container',
  isDebug: getQuery('debug') === '1',
  data,
});

mindmapTree.on('data', (data) => {
  store.save(data);
});
