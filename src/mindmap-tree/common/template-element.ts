
// todo 创建Element 感觉不是很好用
class TemplateElement {
  public element: Element;

  public constructor(tag: string, className: string) {
    this.element = document.createElement(tag);
    this.element.className = className;
  }

  public child(arg: string | TemplateElement): void {
    let childElement: Element | Text;
    if (typeof arg === 'string') {
      childElement = document.createTextNode(arg);
    } else {
      childElement = arg.element;
    }
    this.element.appendChild(childElement);
  }

  public children(...childElements: TemplateElement[]): void {
    childElements.forEach((childElement) => this.child(childElement));
  }

  public removeChild(targetElement: HTMLElement): void {
    this.element.removeChild(targetElement);
  }

  public css(name: string, value: string) {
    // @ts-ignore
    this.element.style[name] = value;
  }

  // public attr(key: string, value: string) {
  //   if (value !== undefined) {
  //     this.el.setAttribute(key, value);
  //   } else {
  //     if (typeof key === 'string') {
  //       return this.el.getAttribute(key);
  //     }
  //     Object.keys(key).forEach((k) => {
  //       this.el.setAttribute(k, key[k]);
  //     });
  //   }
  //   return this;
  // }
}

const h = (tag: string, className: string = '') => new TemplateElement(tag, className);

export {
  TemplateElement,
  h,
};

