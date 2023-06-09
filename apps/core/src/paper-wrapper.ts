import Raphael from 'raphael';
import { isMobile } from './helper';
import type { RaphaelPaper } from 'raphael';

export const wrapperClassName = 'mindmap-graph';

class PaperWrapper {
  private readonly containerDom: HTMLElement;
  private readonly wrapperDom: HTMLDivElement;
  private readonly svgDom: SVGSVGElement | null;
  private readonly paper: RaphaelPaper;
  public constructor(container: string | Element) {
    const graphElement = this.initGraphElement(container);
    this.containerDom = graphElement.containerDom;
    this.wrapperDom = graphElement.wrapperDom;
    const { clientWidth, clientHeight } = this.wrapperDom;
    this.paper = new Raphael(this.wrapperDom, clientWidth, clientHeight);
    this.svgDom = document.querySelector('svg') || null;
  }

  public getPaper(): RaphaelPaper {
    return this.paper;
  }
  public getWrapperDom(): HTMLDivElement {
    return this.wrapperDom;
  }

  public getContainerDom(): HTMLElement {
    return this.containerDom;
  }

  public getSvgDom(): SVGSVGElement | null {
    return this.svgDom;
  }

  public getSize(): { width: number; height: number; } {
    return {
      width: this.wrapperDom.clientWidth,
      height: this.wrapperDom.clientHeight,
    }
  }

  public clear(): void {
    this.paper.clear();
    this.wrapperDom.remove();
  }

  private initGraphElement(container: string | Element): {
    containerDom: HTMLElement;
    wrapperDom: HTMLDivElement;
  } {
    const containerDom = (typeof container === 'string' ? document.querySelector(container) : container) as HTMLElement;
    if (!containerDom) {
      throw new Error('container is not exist');
    }

    if (containerDom.clientWidth === 0 || containerDom.clientHeight === 0) {
      throw new Error('The width or height of Container is not more than 0')
    }

    const backgroundDom = document.createElement('div');
    backgroundDom.className = 'mindmap-graph-background';

    const wrapperDom = document.createElement('div');
    wrapperDom.className = `${wrapperClassName}${isMobile ? ' mobile' : ''}`;
    containerDom.appendChild(wrapperDom);
    containerDom.appendChild(backgroundDom);

    return {
      containerDom,
      wrapperDom,
    };
  }
}

export default PaperWrapper;
