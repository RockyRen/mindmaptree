
class MElement {
  private dom: HTMLElement;
  public constructor(tag: string | HTMLElement, className: string = '') {
    if (typeof tag === 'string') {
      this.dom = document.createElement(tag);
      this.dom.className = className;
    } else {
      this.dom = tag;
    }
  }

  public getDom(): HTMLElement {
    return this.dom;
  }

  public setChildren(...eles: MElement[]): MElement {
    eles.forEach(ele => this.setChild(ele));
    return this;
  }

  public setChild(arg: string | MElement): MElement {
    const ele: Text | HTMLElement = typeof arg === 'string'
      ? document.createTextNode(arg)
      : arg.dom;
    this.dom.appendChild(ele);
    return this;
  }

  public setClassName(v: string): MElement {
    this.dom.className = v;
    return this;
  }

  public addClass(name: string): MElement {
    this.dom.classList.add(name);
    return this;
  }

  public hasClass(name: string): boolean {
    return this.dom.classList.contains(name);
  }

  public removeClass(name: string): MElement {
    this.dom.classList.remove(name);
    return this;
  }


  public setHtml(content: string): MElement {
    this.dom.innerHTML = content;
    return this;
  }

  public setCss(style: Record<string, string>): MElement {
    Object.keys(style).forEach((name: string) => {
      // @ts-ignore
      this.dom.style[name] = style[name];
    });
    return this;
  }

  public addEventListener(...params: Parameters<HTMLElement["addEventListener"]>): void {
    this.dom.addEventListener(...params);
  }

  public removeEventListener(...params: Parameters<HTMLElement["removeEventListener"]>): void {
    this.dom.removeEventListener(...params);
  }
}

const h = (tag: string | HTMLElement, className = '') => new MElement(tag, className);

export {
  MElement,
  h,
};
