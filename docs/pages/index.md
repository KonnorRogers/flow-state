---
layout: default.njk
---

<script type="module">
    import { Application, Controller, reactive } from "flow-state/exports/application.js"

    const application = Application.start()

    application.context = {
        count: reactive(0)
    }

    function increment() {
        application.context.count += 1
        application.updateContext()
    }

    function decrement() {
        application.context.count -= 1
        application.updateContext()
    }

    class CounterController extends Controller {
        static controllerName = "counter"

        increment () {
            increment()
        }
        decrement () {
            decrement()
        }
    }

    application.register(CounterController)
    application.registerGlobalFunction("increment", increment)
    application.registerGlobalFunction("decrement", decrement)
</script>

<div flow-controller="counter">
    <button flow-action="click->counter#decrement">-</button>
    <span flow-text="context.count">0</span>
    <button flow-action="click->counter#increment">+</button>
</div>

<div>
    <button flow-action="click->global#decrement">-</button>
    <span flow-text="context.count">0</span>
    <button flow-action="click->global#increment">+</button>
</div>
