capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const hasEventsMixin = {
  removeEventListeners() {
    if (!this.eventListeners) {
      return
    }
    for (const [eventName,listeners] of Object.entries(this.eventListeners)) {
      listeners.forEach( (listener) => {
        this.removeEventListener(eventName,listener)
      })
    }
  }
  
}
const HasEvents = {
  mixInto(klass) {
    if (!klass.events) {
      throw `In ${klass.name} You must define a static events object to configure which events you expose`
    }
    for (const [key,value] of Object.entries(klass.events)) {
      const onMethodName = `on${capitalize(key)}`
      const dispatchMethodName = `dispatch${capitalize(key)}`
      const debugMethodName = `_debug${capitalize(key)}`

      if (klass.prototype[onMethodName]) {
        throw `${klass.name} already has a method named ${onMethodName}, which clases with the event ${key}`
      }

      if (klass.prototype[dispatchMethodName]) {
        throw `${klass.name} already has a method named ${dispatchMethodName}, which clases with the event ${key}`
      }

      if (klass.prototype[debugMethodName]) {
        throw `${klass.name} already has a method named ${debugMethodName}, which clases with the event ${key}`
      }

      klass.prototype[onMethodName] = function(listener) {
        if (!this.eventListeners) {
          this.eventListeners = {}
        }
        if (!this.eventListeners[key]) {
          this.eventListeners[key] = []
        }
        this.addEventListener(key,listener)
        this.eventListeners[key].push(listener)
      }
      klass.prototype[dispatchMethodName] = function(detail) {
        this.dispatchEvent(new CustomEvent(key, { detail }))
      }
      klass.prototype[debugMethodName] = function() {
        this[onMethodName]( (event) => {
          console.debug(`${key}: %o\n${key}: Event: %o`,event.detail,event)
        })
      }
    }
    Object.assign(klass.prototype,hasEventsMixin)
  }

}

export default HasEvents
