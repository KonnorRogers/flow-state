import { html, fixture, assert } from "@open-wc/testing"
import "../exports/components/example-component/example-component-register.js"

suite('<example-component>', () => {
  test("Should render a component", async () => {
    const el = await fixture(html` <example-component></example-component> `);

    assert(el.matches(":defined"), `"${el.tagName.toLowerCase()}" element should be ":defined"`)
  })
})
