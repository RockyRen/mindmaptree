import * as Y from 'yjs';
import { initPage } from './common/init-page';
import { WebrtcProvider } from 'y-webrtc';
import './common/common.less';

const ydoc = new Y.Doc();

const mindmapTree = initPage({
  pageName: 'collaborate',
  options: {
    ydoc,
  },
});

const provider = new WebrtcProvider('demo-room', ydoc);

mindmapTree.bindAwareness(provider.awareness);

