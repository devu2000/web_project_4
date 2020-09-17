//renders a list of elements on a page
export default class Section {
  constructor({ items, renderer, containerSelector }) {
    this._renderedItems = items;
    this._renderer = renderer;
    this._container = document.querySelector(containerSelector);
  }

  addItem(element) {
    this._container.prepend(element);
  }

  clear() {
    this._container.innerHTML = "";
  }

  renderItems() {
    this.clear();
    this._renderedItems.forEach((item) => {
      this._renderer(item);
    });
  }
}
