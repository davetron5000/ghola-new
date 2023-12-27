# ghola - color palette generator for devs

## Features

* Adjust brightness based on reference color
* Save choices in the url and pick them out as well

## Web Components

Here's what SUCKS:

* Triggering logic by setting attributes directly
* Non-custom elements have no easy way to be a class we can attach logic to, e.g. onClick on a button will preventDefault if we want

What I think is OK:

* Not having a blob of state that everyone can reach into - each component has its own state and publicizes events

Idea:

* No setAttribute() allowed - must call a method to force the component to perform an action, e.g. this.$scaleComponent.changeHexCode(hexCode)
* ProxyElement wrapper for any existing HTMLElement so that non-custom elements can be treated the same way
* 

## Setup

1. Clone this repo
2. Install Docker
3. `dx/build`
4. `dx/start`
5. In another window:
   1. `dx/exec bin/setup`
   2. `dx/exec bin/dev`
6. Open `http://localhost:5555` in your browser
