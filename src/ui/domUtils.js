export function createElement(tag, parent, options = {}) {
    const element = document.createElement(tag);

    if (options.text) element.textContent = options.text;
    
    // accepts an string "class1 class2" or an array ["class1", "class2"]
    if (options.className) {
        if (Array.isArray(options.className)) {
            element.classList.add(...options.className);
        } else {
            element.className = options.className;
        }
    }

    if (options.attributes) {
        Object.entries(options.attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }

    // add events (i.e: { click: () => console.log('Task added!') })
    if (options.events) {
        Object.entries(options.events).forEach(([event, handler]) => {
            element.addEventListener(event, handler);
        });
    }

    if (parent) parent.appendChild(element);
    return element;
}