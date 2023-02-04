import MindemapTree from '../core/src/index';
import './common/common.less';
import { isDebug } from './common/is-debug';
import type { NodeDataMap } from '../core/src/data/data-proxy';

const data: NodeDataMap = {
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


new MindemapTree({
  container: '#container',
  data,
  isDebug,
});
