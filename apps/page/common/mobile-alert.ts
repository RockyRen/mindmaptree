// @ts-ignore
import infoSvg from '../img/info.svg';
// @ts-ignore
import closeSvg from '../img/close.svg';

let timer: ReturnType<typeof setTimeout> | null = null;

export const showMobileAlert = (text: string, duration: number = 10000): void => {
  const mobileAlert = document.createElement('div');
  mobileAlert.classList.add('mobile-alert');
  const mobileAlertIcon = document.createElement('img');
  mobileAlertIcon.classList.add('mobile-alert-icon');
  mobileAlertIcon.src = infoSvg;
  const mobileAlertText = document.createElement('div');
  mobileAlertText.classList.add('mobile-alert-text');
  const mobileAlertClose = document.createElement('img');
  mobileAlertClose.classList.add('mobile-alert-close');
  mobileAlertClose.src = closeSvg;

  mobileAlertText.innerText = text;

  mobileAlert.appendChild(mobileAlertIcon);
  mobileAlert.appendChild(mobileAlertText);
  mobileAlert.appendChild(mobileAlertClose);
  document.body.appendChild(mobileAlert);


  const close = () => {
    mobileAlert.style.opacity = '0';
    setTimeout(() => {
      mobileAlert.style.zIndex = '-1';
    }, 310);
  }

  mobileAlertClose.addEventListener('click', () => {
    close();
    timer && clearTimeout(timer);
  }, false);

  timer = setTimeout(() => {
    close();
  }, duration);
};
