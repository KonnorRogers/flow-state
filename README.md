# `downflow`

## WIP: Come back later

## Purpose

Some amalgamation between Stimulus and Alpine, with less focus on component level state, and instead looking to (ab)use "app level" state.

I eventually want to look into how you can hook up component-like rendering as well, possibly using `<template>` tags, but baby steps...

The basic idea is: "You have HTML from a server, you know the app state from the server, there's no reason you shouldn't be able to use that and be able to update all the places that need it"

Right now im affectionately calling it "downflow", with the idea being data "flows" down.

## Documentation

`flow-controller` - mixins
`flow-action` - events
`flow-text` - sets `element.textContent`
`flow-component` - "stamps" a component for re-rendering.

```html
<script type="template">
    <div data-component="foo">
        <button data-action="#decrement">-</button>
        <span flow-text="context.foo"></span>
        <button data-action="#increment">+</button>
    </div>
</script>

<div data-component="foo">
    <button data-action="#decrement">-</button>
    <span>0</span>
    <button data-action="#increment">+</button>
</div>
```


Coming Soon™️

## Structure

`exports/` is publicly available files
`internal/` is...well...internal.

`exports` and `internal` should **NOT** write their own `.d.ts` that are co-located.

`types/` is where you place your handwritten `.d.ts` files.
