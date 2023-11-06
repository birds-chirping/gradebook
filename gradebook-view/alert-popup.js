import { Elements } from "../utils/utils.js";
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
    this.messageContainer = Elements.createElement("div", "message-container");
    return this.messageContainer;
  }

  createInputArea() {
    const inputArea = Elements.createElement("div", "alert-popup-inputs-wrapper");
    this.yesButton = Elements.createElement("button", "yes-button");
    this.yesButton.textContent = "Yes";

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
