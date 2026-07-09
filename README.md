# `downflow`

## WIP: Come back later

## Purpose

Some amalgamation between Stimulus and Alpine, with less focus on component level state, and instead looking to (ab)use "app level" state.

I eventually want to look into how you can hook up component-like rendering as well, possibly using `<template>` tags, but baby steps...

The basic idea is: "You have HTML from a server, you know the app state from the server, there's no reason you shouldn't be able to use that and be able to update all the places that need it"

Right now im affectionately calling it "downflow", with the idea being data "flows" down.

## Documentation

- `flow-controller="<controller_name>"` - mixins (Stimulus Controllers)
- `flow-action="<event>"` - events
- `flow-text="<state>"` - sets `element.textContent`

## Not implemented

- `flow-prop="<property>:<value>"` - sets a given property
- `flow-attr="<attribute>:<value>"` - sets a given attribute
- `flow-component="<name>"` - "stamps" a component for re-rendering.
- `flow-render="<component-name>"` - Renders a component with a given name
- `flow-scope="<state>"` - Sets a top level scope that can be accessed via `#<key>`

```html
<template flow-component="bar">
    <!-- # automatically inherits the "scope" of whatever is passed to the component. -->
    <span flow-text="#comment"></span>
    <form flow-prop:action="#url">
        <textarea></textarea>
        <button flow-action="#reply">Leave a reply</button>
    </form>
</template>

<div
    flow-for="post in context.posts"
    flow-render="bar"
    flow-key="id"
>
</div>

<div
    flow-for="post in my-controller#posts"
    flow-render="bar"
    flow-key="id"
>
</div>
```


Coming Soon™️

## Structure

`exports/` is publicly available files
`internal/` is...well...internal.

`exports` and `internal` should **NOT** write their own `.d.ts` that are co-located.

`types/` is where you place your handwritten `.d.ts` files.
