let node, cssProps, cssName, injectNeeded

// Checks to see if environment has window: is in browser and not server
const isBrowser = typeof window !== 'undefined'

const createNode = () => {
  // Create new element with correct type
  const newStyleNode = createElement('style')

  // Replaces any user node or inserts a new one into head
  const userNode = selectElement('style[type=storm]')

  changeAttribute(newStyleNode, 'type', 'text/css')

  // Check for user node
  if (userNode) {
    if (userNode.id) {
      newStyleNode.id = userNode.id
      userNode.parentNode.replaceChild(newStyleNode, userNode)
    }
  } else {
    // create and add new style node
    document.head.appendChild(newStyleNode)
  }

  // return style node that is created
  return newStyleNode
}

if (isBrowser) {
  createNode()
  cssProps = node.styles
}

// Add new styles to be injected later in DOM
const add = (cssProp, elementName) => {
  cssName[elementName] = cssProp
  injectNeeded = true
}

// Inject all new styles into DOM
const inject = () => {
  if (!isBrowser || !injectNeeded) {
    return false
  } else {
    injectNeeded = true
    const style = Object.keys(cssName)
      .map(i => cssName[i])
      .join('\n')

    if (cssProps) {
      cssProps.css = style
    } else {
      node.innerHTML = style
    }
  }
}

// Remove tag style from DOM
const remove = (elementName) => {
  delete cssName[elementName]
  injectNeeded = true
}

// Object used to manage CSS of all elements
const config = {
  add,
  inject,
  node,
  remove
}

/**
 * Shortcut for creating element
 * @param   { String } tagName - Type of element created
 * @returns { Object } Element that is created
 */
const createElement = (tagName) => document.createElement(tagName)

/**
 * Select node in DOM
 * @param   { String } selector - DOM selector
 * @param   { Object } context - Node where the target of search is located
 * @returns { Object } Node that is found
 */
const selectElement = (selector, context) => (context || document).querySelector(selector)

/**
 * Change DOM attribute
 * @param { Object } dom - Node that is being updated
 * @param { String } attributeName - cssName of property that is being set
 * @param { String } value - value of the property we want to set
 */
const changeAttribute = (dom, attributeName, value) => dom.setAttribute(attributeName, value)

export default config
