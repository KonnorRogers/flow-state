import { aTimeout, fixture, html } from "@open-wc/testing-helpers";
import { assert } from "@esm-bundle/chai";
import { Application, Controller } from "downflow";
import Sinon from "sinon";

test("It should have target functions in the constructor", () => {
  class Example extends Controller {
    static targets = ["item"];

    constructor(...args) {
      super(...args);

      assert.equal(this.hasItemTarget, false);
      assert.equal(this.itemTarget, null);
      assert.equal(this.itemTargets.length, 0);
    }
  }

  new Example({
    element: document.createElement("div"),
    application: Application.start(),
  });
});

test("It should record when a target connects", async () => {
  const application = Application.start();

  const itemTargetConnectedSpy = Sinon.spy();
  const itemTargetDisconnectedSpy = Sinon.spy();

  application.register(
    class Example extends Controller {
      static targets = ["item"];
      static controllerName = "example";

      itemTargetConnected() {
        itemTargetConnectedSpy();
      }

      itemTargetDisconnected() {
        itemTargetDisconnectedSpy();
      }
    },
  );

  const el = await fixture(html`
    <div flow-controller="example">
      <div flow-target="example.item"></div>
      <div flow-target="example.item"></div>
      <div flow-target="example.item"></div>
    </div>
  `);

  await aTimeout(1);
  const controller = application.getController(el, "example");

  assert.equal(controller.hasItemTarget, true);
  assert.equal(controller.itemTargets.length, 3);
  assert.equal(controller.itemTarget, el.querySelector("[flow-target]"));

  el.querySelectorAll("[flow-target~='example.item']").forEach(
    (target, index) => {
      assert.equal(target, controller.itemTargets[index]);
    },
  );
});

test("It should record when a target attribute changes and disconnects", async () => {
  const application = Application.start();

  const itemTargetConnectedSpy = Sinon.spy();
  const itemTargetDisconnectedSpy = Sinon.spy();

  application.register(
    class Example extends Controller {
      static targets = ["item"];
      static controllerName = "example";

      itemTargetConnected() {
        itemTargetConnectedSpy();
      }

      itemTargetDisconnected() {
        itemTargetDisconnectedSpy();
      }
    },
  );

  const el = await fixture(html`
    <div flow-controller="example">
      <div flow-target="example.item"></div>
      <div></div>
    </div>
  `);

  await aTimeout(1);
  const controller = application.getController(el, "example");

  assert.equal(itemTargetDisconnectedSpy.calledOnce, false);

  el.querySelectorAll("div")[0].setAttribute("flow-target", "");
  await aTimeout(1);
  assert.equal(controller.hasItemTarget, false);
  assert.equal(controller.itemTarget, null);
  assert.equal(controller.itemTargets.length, 0);

  assert.equal(itemTargetDisconnectedSpy.callCount, 1);
});

test("It should record when a target element changes its attribute and connects", async () => {
  const application = Application.start();

  const itemTargetConnectedSpy = Sinon.spy();
  const itemTargetDisconnectedSpy = Sinon.spy();

  application.register(
    class Example extends Controller {
      static targets = ["item"];
      static controllerName = "example";

      itemTargetConnected() {
        itemTargetConnectedSpy();
      }

      itemTargetDisconnected() {
        itemTargetDisconnectedSpy();
      }
    },
  );

  const el = await fixture(html`
    <div flow-controller="example">
      <div flow-target="example.item"></div>
      <div></div>
    </div>
  `);

  await aTimeout(1);
  const controller = application.getController(el, "example");

  assert.equal(controller.hasItemTarget, true);
  assert.equal(controller.itemTargets.length, 1);
  assert.equal(controller.itemTarget, el.querySelector("[flow-target]"));

  el.querySelectorAll("[flow-target~='example.item']").forEach(
    (target, index) => {
      assert.equal(target, controller.itemTargets[index]);
    },
  );

  el.querySelectorAll("div")[1].setAttribute("flow-target", "example.item");

  await aTimeout(1);

  assert.equal(controller.hasItemTarget, true);
  assert.equal(controller.itemTargets.length, 2);
  assert.equal(controller.itemTarget, el.querySelector("[flow-target]"));

  el.querySelectorAll("[flow-target~='example.item']").forEach(
    (target, index) => {
      assert.equal(target, controller.itemTargets[index]);
    },
  );
});

test("It should not count nested targets", async () => {
  const application = Application.start();

  const itemTargetConnectedSpy = Sinon.spy();
  const itemTargetDisconnectedSpy = Sinon.spy();

  application.register(
    class Example extends Controller {
      static targets = ["item"];
      static controllerName = "example";

      itemTargetConnected() {
        itemTargetConnectedSpy();
      }

      itemTargetDisconnected() {
        itemTargetDisconnectedSpy();
      }
    },
  );

  const el = await fixture(html`
    <div flow-controller="example">
      <div flow-target="example.item"></div>
      <div flow-target="example.item"></div>
      <div flow-target="example.item"></div>
      <div id="nested-example" flow-controller="example">
        <div id="nested-1" class="nested" flow-target="example.item"></div>
        <div id="nested-2" class="nested" flow-target="example.item"></div>
      </div>
    </div>
  `);

  const controller = application.getController(el, "example");
  const nestedController = application.getController(
    el.querySelector("[flow-controller~='example']"),
    "example",
  );

  assert.equal(controller.hasItemTarget, true);
  assert.equal(controller.itemTargets.length, 3);
  assert.equal(controller.itemTarget, el.querySelector("[flow-target]"));

  nestedController.element
    .querySelectorAll(".nested[flow-target~='example.item']")
    .forEach((target, index) => {
      assert.equal(target, nestedController.itemTargets[index]);
    });

  assert.equal(itemTargetConnectedSpy.callCount, 5);
});

test("Should record target disconnects when the parent disconnect", async () => {
  const application = Application.start();

  const itemTargetDisconnectedSpy = Sinon.spy();
  const controllerDisconnectedSpy = Sinon.spy();
  const callOrder = [];

  application.register(
    class Example extends Controller {
      static targets = ["item"];
      static controllerName = "example";

      connectedCallback() {
        callOrder.push("connectedCallback");
      }

      disconnectedCallback() {
        controllerDisconnectedSpy();
        callOrder.push("disconnectedCallback");
      }

      itemTargetConnected() {
        callOrder.push("itemTargetConnected");
      }

      itemTargetDisconnected() {
        callOrder.push("itemTargetDisconnected");
        itemTargetDisconnectedSpy();
      }
    },
  );

  const el = await fixture(html`
    <div flow-controller="example">
      <div flow-target="example.item"></div>
    </div>
  `);

  await aTimeout(1);

  assert.equal(controllerDisconnectedSpy.calledOnce, false);
  assert.equal(itemTargetDisconnectedSpy.calledOnce, false);

  el.remove();

  await aTimeout(1);

  assert.equal(controllerDisconnectedSpy.calledOnce, true);
  assert.equal(itemTargetDisconnectedSpy.calledOnce, true);

  assert.equal(callOrder.length, 4);
  assert.deepEqual(callOrder, [
    "connectedCallback",
    "itemTargetConnected",
    "itemTargetDisconnected",
    "disconnectedCallback",
  ]);
});

test("It should only disconnect nested targets when using multiple controllers", async () => {
  const application = Application.start();

  const exampleOneDisconnectedSpy = Sinon.spy();
  const exampleTwoDisconnectedSpy = Sinon.spy();

  const el = document.createElement("div");
  el.innerHTML = `
    <div flow-controller="example-1 example-2">
      <div flow-target="example-1.item"></div>
      <div flow-target="example-1.item example-2.item"></div>
      <div flow-target="example-1.item example-2.item"></div>
      <div id="nested" flow-controller="example-1">
        <div id="nested-1" class="nested" flow-target="example-1.item example-2.item"></div>
        <div id="nested-2" class="nested" flow-target="example-1.item example-2.item"></div>
      </div>
    </div>
  `;

  document.body.append(el);

  application.register(
    class Example2 extends Controller {
      static targets = ["item"];
      static controllerName = "example-2";

      itemTargetDisconnected(el) {
        exampleTwoDisconnectedSpy();
      }
    },
  );

  application.register(
    class Example extends Controller {
      static targets = ["item"];
      static controllerName = "example-1";

      itemTargetDisconnected() {
        exampleOneDisconnectedSpy();
      }
    },
  );

  await aTimeout(10);

  assert.equal(exampleOneDisconnectedSpy.callCount, 0);
  assert.equal(exampleTwoDisconnectedSpy.callCount, 0);

  const nestedExample1 = el.querySelector("#nested-1");
  nestedExample1.remove();

  await aTimeout(10);
  assert.equal(exampleOneDisconnectedSpy.callCount, 1);
  assert.equal(exampleTwoDisconnectedSpy.callCount, 1);

  const nestedExample2 = el.querySelector("#nested-2");
  nestedExample2.remove();

  await aTimeout(10);
  assert.equal(exampleOneDisconnectedSpy.callCount, 2);
  assert.equal(exampleTwoDisconnectedSpy.callCount, 2);

  application.stop();
  await aTimeout(1000);
  el.remove();
});

test("It should not count nested targets when using multiple controllers", async () => {
  const application = Application.start();

  const itemTargetConnectedSpy = Sinon.spy();
  const itemTargetDisconnectedSpy = Sinon.spy();

  application.register(
    class Example extends Controller {
      static targets = ["item"];
      static controllerName = "example-1";

      itemTargetConnected() {
        itemTargetConnectedSpy();
      }

      itemTargetDisconnected() {
        itemTargetDisconnectedSpy();
      }
    },
  );

  application.register(
    class Example2 extends Controller {
      static targets = ["item"];
      static controllerName = "example-2";

      itemTargetConnected() {
        itemTargetConnectedSpy();
      }

      itemTargetDisconnected() {
        itemTargetDisconnectedSpy();
      }
    },
  );

  const el = await fixture(html`
    <div flow-controller="example-1 example-2">
      <div flow-target="example-1.item"></div>
      <div flow-target="example-1.item example-2.item"></div>
      <div flow-target="example-1.item example-2.item"></div>
      <div id="nested-example" flow-controller="example-1">
        <div
          id="nested-1"
          class="nested"
          flow-target="example-1.item example-2.item"
        ></div>
        <div
          id="nested-2"
          class="nested"
          flow-target="example-1.item example-2.item"
        ></div>
      </div>
    </div>
  `);

  await aTimeout(0);

  const controller = application.getController(el, "example-1");
  const controller2 = application.getController(el, "example-2");
  const nestedController = application.getController(
    el.querySelector("[flow-controller~='example-1']"),
    "example-1",
  );

  assert.equal(controller2.hasItemTarget, true);
  assert.equal(controller2.itemTargets.length, 4);
  assert.equal(controller2.itemTarget, el.querySelectorAll("[flow-target]")[1]);

  assert.equal(controller.hasItemTarget, true);
  assert.equal(controller.itemTargets.length, 3);
  assert.equal(controller.itemTarget, el.querySelector("[flow-target]"));

  nestedController.element
    .querySelectorAll(".nested[flow-target~='example-1.item']")
    .forEach((target, index) => {
      assert.equal(target, nestedController.itemTargets[index]);
    });

  // We added 4 extra calls for example-2
  assert.equal(itemTargetConnectedSpy.callCount, 9);

  el.querySelector("#nested-1").remove();

  await aTimeout(1);
  // 1 time for example-1 and example-2
  assert.equal(itemTargetDisconnectedSpy.callCount, 2);

  el.querySelector("#nested-2").remove();

  await aTimeout(1);
  // 1 time for example-1 and example-2
  assert.equal(itemTargetDisconnectedSpy.callCount, 4);

  el.querySelector("[flow-target]").setAttribute(
    "flow-target",
    "example-2.item",
  );

  await aTimeout(1);
  assert.equal(itemTargetConnectedSpy.callCount, 9);
  assert.equal(itemTargetDisconnectedSpy.callCount, 5);

  el.querySelector("[flow-controller~='example-1']").remove();
  await aTimeout(1);
  // Should not fire any disconnects despite a controller being removed
  assert.equal(itemTargetDisconnectedSpy.callCount, 5);
});
