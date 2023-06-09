import { initPage } from './common/init-page';
import { showMobileAlert } from './common/mobile-alert';
import { data } from './data/resume-data';
import './common/common.less';
import { isMobile } from '../core/src/helper';

if (isMobile) {
  showMobileAlert('移动端不支持多数功能，请到PC端体验');
}

initPage({
  pageName: 'resume',
  options: {
    data,
  },
});
