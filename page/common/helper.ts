import { isMobile } from "../../core/src/helper";

export const getQuery = (key: string): string => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  return params[key] || '';
};

export const createGithubLink = () => {
  const githubLink = document.createElement('div');
  githubLink.classList.add('github-link');
  const githubIcon = document.createElement('div');
  githubIcon.classList.add('github-icon');

  if (isMobile) {
    githubLink.classList.add('mobile');
  }

  githubLink.appendChild(githubIcon);
  document.body.appendChild(githubLink);
}
