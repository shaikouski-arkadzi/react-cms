const enableEditingOnElement = (element, handleInput) => {
  element.contentEditable = "true";
  element.focus();
  element.addEventListener("input", handleInput);
};

export const clickHandler = (element, handleInput) => {
  enableEditingOnElement(element, handleInput);
};

export const blurHandler = (element, handleInput) => {
  element.contentEditable = "false";
  element.removeEventListener("input", handleInput);
};

export const keyPressHandler = (event, element) => {
  if (event.key === "Enter" || event.keyCode === 13) {
    element.blur();
  }
};

export const contextMenuHandler = (event, element, handleInput) => {
  const parentTag = element.parentNode?.nodeName;
  if (parentTag === "A" || parentTag === "BUTTON") {
    event.preventDefault();
    enableEditingOnElement(element, handleInput);
  }
};
