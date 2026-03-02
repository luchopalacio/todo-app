export function createElement(tag, parent, options = {}) {
    const element = document.createElement(tag);

    if (options.text) element.textContent = options.text;
    
    // Acepta un string "clase1 clase2" o un array ["clase1", "clase2"]
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

    // Agregar eventos directamente (ej: { click: () => console.log('hola') })
    if (options.events) {
        Object.entries(options.events).forEach(([event, handler]) => {
            element.addEventListener(event, handler);
        });
    }

    if (parent) parent.appendChild(element);
    return element;
}