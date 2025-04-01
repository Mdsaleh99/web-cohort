/*
* 1. Event Emitter Pattern
    The Event Emitter pattern is used to handle and trigger events in a system. It allows multiple parts of an application to listen for events and respond when they occur.

How it works:
    1. An event emitter object maintains a list of events and their corresponding listeners (callback functions).
    2. When an event is triggered (emitted), all the registered listeners for that event execute.
    3. It is commonly used in Node.js (EventEmitter module) for handling events.

! =====================================================================================

* 2. Observer Design Pattern
    The Observer pattern is a design pattern where an object (subject) maintains a list of observers and notifies them when a change occurs.

How it works:
   1. A subject (publisher) maintains a list of observers (subscribers).
   2. When the subject updates, it notifies all observers.
   3. It is commonly used in UI frameworks (React, Vue) and event-driven programming.

   ! https://refactoring.guru/design-patterns/observer

*/


class MyEventEmitter {
    constructor(){
      this.__event_listeners = {}; // event ko listeners k array pe map karega          [event]: listeners[] . it is like observer design pattern
    }
    
    on(event, listener){
        // Register the [listener] for [event]
        if (!this.__event_listeners[event]) {
            this.__event_listeners[event] = [] 
        }
        this.__event_listeners[event].push(listener)
        return true
    }

    emit(event, ...agrs) {
        if (!this.__event_listeners[event]) {
            return false
        }

        const listeners = this.__event_listeners[event]
        listeners.forEach((listener) => listener(...agrs))
    }

    off(event, listener) {
        if (!this.__event_listeners[event]) {
          return false;
        }

        const index = this.__event_listeners[event].indexOf(listener)
        if (index < 0) {
            return false
        }
        this.__event_listeners[event].splice(index, 1)
        return true
    }

    once(event, listener) {
        const wrapperFn = (...args) => {
            listener(...args)
            this.off(event, wrapperFn)
        }
        this.on(event, wrapperFn)
        return true
    }

}

const e = new MyEventEmitter()

const sendWhatsapp = (username) => console.log("Whatsapp to: ", username);


e.on('user:signup', (username) => console.log("User signup"))
e.on('user:signup', (username) => console.log("Sending Email to: ", username))
e.once('user:signup', sendWhatsapp)
e.on('user:logout', (username) => console.log("Logout", username))



e.emit('user:signup', '@md.saleh')
e.emit('user:signup', '@md.saleh-1')

e.off("user:signup", sendWhatsapp);

e.emit('user:signup', '@md.saleh-2')

e.emit("user:logout", "@md.saleh");