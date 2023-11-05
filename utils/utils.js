export class Elements {
  static getElement(selector) {
    return document.querySelector(selector);
  }

  static createElement(tag, ...className) {
    const element = document.createElement(tag);
    if (className) element.classList.add(...className);
    return element;
  }
}
