
export const deepActiveElementPath = (doc = window.document): Element[] => {
  let activeElement = doc.activeElement;
  const path: Element[] = [];

  if (!activeElement) {
    return path;
  }

  while (activeElement) {
    path.push(activeElement);
    if (activeElement.shadowRoot) {
      activeElement = activeElement.shadowRoot.activeElement;
    } else {
      break;
    }
  }

  return path;
};

export function addHasRemoveClass(element: HTMLElement) {
  return {
    addClass: (className: string) => {
      element.classList.add(className);
    },
    removeClass: (className: string) => {
      element.classList.remove(className);
    },
    hasClass: (className: string) => element.classList.contains(className),
  };
}


let supportsPassive = false;
const fn = () => { /* empty listener */ };
const optionsBlock: AddEventListenerOptions = {
  get passive() {
    supportsPassive = true;
    return false;
  }
};
document.addEventListener('x', fn, optionsBlock);
document.removeEventListener('x', fn);
/**
 * Do event listeners suport the `passive` option?
 */
export const supportsPassiveEventListener = supportsPassive;
