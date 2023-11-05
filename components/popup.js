import { Elements } from "../utils/utils.js";

export class Popup {
  overlayBackground;
  popupCloseBtn;
  frame;

  constructor() {
    this.overlayBackground = Elements.createElement("div", "popup-overlay-background", "hide");
    this.frame = Elements.createElement("div", "popup-frame", "hide");
    this.addCloseButton();
    this.addEvents();
  }

  addPopupElements(elements) {
    elements.forEach((element) => {
      this.frame.appendChild(element);
    });
  }

  addCloseButton() {
    this.popupCloseBtn = Elements.createElement("button", "close-popup-btn");
    this.popupCloseBtn.innerHTML = '<i class="fa-regular fa-circle-xmark"></i>';
    this.frame.appendChild(this.popupCloseBtn);
  }

  popupToggle() {
    this.overlayBackground.classList.toggle("hide");
    this.frame.classList.toggle("hide");
  }

  closePopup() {
    this.popupToggle();
  }

  addEvents() {
    document.addEventListener("click", this.onClick.bind(this));
    document.addEventListener("keyup", this.onKeyUp.bind(this));
  }

  onKeyUp(e) {
    if (e.key === "Escape" && !this.overlayBackground.classList.contains("hide")) {
      this.closePopup();
    }
  }

  onClick(e) {
    if (e.target.classList.contains("popup-overlay-background") || e.target.classList.contains("close-popup-btn")) {
      this.closePopup();
    }
  }
}
