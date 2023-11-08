import { Elements } from "../utils/elements.js";
import { Popup } from "../components/popup.js";

export class AlertPopup extends Popup {
  messageContainer;
  yesButton;
  cancelButton;
  action;

  constructor(...args) {
    super(...args);
    this.addPopupElements(this.createMessageContainer(), this.createInputArea());
    this.addPopupEvents();
  }

  createMessageContainer() {
    const messageArea = Elements.createElement("div", "message-wrapper");
    const iconContainer = Elements.createElement("div", "alert-icon-wrapper");
    iconContainer.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>';
    this.messageContainer = Elements.createElement("div", "message-container");
    messageArea.append(iconContainer, this.messageContainer);
    return messageArea;
  }

  createInputArea() {
    const inputArea = Elements.createElement("div", "alert-popup-inputs-wrapper");
    this.yesButton = Elements.createElement("button", "yes-button");
    this.yesButton.textContent = "Delete";

    this.cancelButton = Elements.createElement("button", "cancel-button");
    this.cancelButton.textContent = "Cancel";
    inputArea.append(this.yesButton, this.cancelButton);
    return inputArea;
  }

  alert(message) {
    this.messageContainer.textContent = message;
    this.popupToggle();
  }

  bindAction(handler, ...elements) {
    this.action = () => handler(...elements);
  }

  addPopupEvents() {
    this.cancelButton.addEventListener("click", this.closePopup.bind(this));
    this.yesButton.addEventListener("click", () => {
      this.action();
      this.closePopup();
    });
  }
}
