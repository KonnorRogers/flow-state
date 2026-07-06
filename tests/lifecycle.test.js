import { aTimeout, fixture, html } from "@open-wc/testing-helpers";
import { assert } from "@esm-bundle/chai";
import { Application, Controller } from "downflow";
import Sinon from "sinon";

setup(() => {
  Sinon.restore();
});

test("It should bind to document and listen for new controllers (append nested)", async () => {
  const application = Application.start();

  const connectSpy = Sinon.spy();
  const disconnectSpy = Sinon.spy();
  const constructorSpy = Sinon.spy();

  application.register(
    class Example extends Controller {
      static controllerName = "example";

      constructor(element) {
        super(element);
        assert.instanceOf(this.element, HTMLElement);
        constructorSpy();
      }

      connectedCallback() {
        assert.instanceOf(this.element, HTMLElement);
        connectSpy();
      }

      disconnectedCallback() {
        assert.instanceOf(this.element, HTMLElement);
        disconnectSpy();
      }
    },
  );

  Sinon.assert.notCalled(constructorSpy);
  Sinon.assert.notCalled(connectSpy);
  Sinon.assert.notCalled(disconnectSpy);

  const el = await fixture(html`
    <div>
      <div flow-controller="example"></div>
    </div>
  `);

  Sinon.assert.calledOnce(constructorSpy);
  Sinon.assert.calledOnce(connectSpy);
  Sinon.assert.notCalled(disconnectSpy);

  el.remove();
  await aTimeout(1);
  Sinon.assert.calledOnce(constructorSpy);
  Sinon.assert.calledOnce(connectSpy);
  Sinon.assert.calledOnce(disconnectSpy);

  document.body.append(el);
  await aTimeout(1);

  Sinon.assert.calledOnce(constructorSpy);
  Sinon.assert.calledTwice(connectSpy);
  Sinon.assert.calledOnce(disconnectSpy);

  el.remove();
  await aTimeout(1);
  Sinon.assert.calledOnce(constructorSpy);
  Sinon.assert.calledTwice(connectSpy);
  Sinon.assert.calledTwice(disconnectSpy);

  application.stop();
});

/**
 * Test again, this time with a slightly different fixture.
 */
test("It should bind root level and listen for new controllers (append top-level)", async () => {
  const application = Application.start();

  const connectSpy = Sinon.spy();
  const disconnectSpy = Sinon.spy();
  const constructorSpy = Sinon.spy();

  application.register(
    class Example extends Controller {
      static controllerName = "example";
      constructor(element) {
        super(element);
        assert.instanceOf(this.element, HTMLElement);
        constructorSpy();
      }

      connectedCallback() {
        assert.instanceOf(this.element, HTMLElement);
        connectSpy();
      }

      disconnectedCallback() {
        assert.instanceOf(this.element, HTMLElement);
        disconnectSpy();
      }
    },
  );

  Sinon.assert.notCalled(constructorSpy);
  Sinon.assert.notCalled(connectSpy);
  Sinon.assert.notCalled(disconnectSpy);

  const el = await fixture(html` <div flow-controller="example"></div> `);

  Sinon.assert.calledOnce(constructorSpy);
  Sinon.assert.calledOnce(connectSpy);
  Sinon.assert.notCalled(disconnectSpy);

  el.remove();
  await aTimeout(1);
  Sinon.assert.calledOnce(constructorSpy);
  Sinon.assert.calledOnce(connectSpy);
  Sinon.assert.calledOnce(disconnectSpy);

  document.body.append(el);
  await aTimeout(1);

  Sinon.assert.calledOnce(constructorSpy);
  Sinon.assert.calledTwice(connectSpy);
  Sinon.assert.calledOnce(disconnectSpy);

  el.remove();
  await aTimeout(1);
  Sinon.assert.calledOnce(constructorSpy);
  Sinon.assert.calledTwice(connectSpy);
  Sinon.assert.calledTwice(disconnectSpy);

  application.stop();
});

test("It should invoke the lifecycle if the controllers already exist in the DOM.", async () => {
  const el = await fixture(html`<div flow-controller="example"></div>`);
  await aTimeout(1);

  const application = Application.start();

  const connectSpy = Sinon.spy();
  const disconnectSpy = Sinon.spy();
  const constructorSpy = Sinon.spy();

  application.register(
    class Example extends Controller {
      static controllerName = "example";
      constructor(element) {
        super(element);
        assert.instanceOf(this.element, HTMLElement);
        constructorSpy();
      }

      connectedCallback() {
        assert.instanceOf(this.element, HTMLElement);
        connectSpy();
      }

      disconnectedCallback() {
        assert.instanceOf(this.element, HTMLElement);
        disconnectSpy();
      }
    },
  );

  Sinon.assert.calledOnce(constructorSpy);

  application.stop();
});

test("It should invoke lifecycles when attributes change", async () => {
  const el = await fixture(html`<div></div>`);
  await aTimeout(1);

  const application = Application.start();

  const connectSpy = Sinon.spy();
  const disconnectSpy = Sinon.spy();
  const constructorSpy = Sinon.spy();

  application.register(
    class Example extends Controller {
      static controllerName = "example";
      constructor(element) {
        super(element);
        assert.instanceOf(this.element, HTMLElement);
        constructorSpy();
      }

      connectedCallback() {
        assert.instanceOf(this.element, HTMLElement);
        connectSpy();
      }

      disconnectedCallback() {
        assert.instanceOf(this.element, HTMLElement);
        disconnectSpy();
      }
    },
  );

  Sinon.assert.notCalled(constructorSpy);
  Sinon.assert.notCalled(connectSpy);
  Sinon.assert.notCalled(disconnectSpy);

  el.setAttribute("flow-controller", "example");
  await aTimeout(1);

  Sinon.assert.calledOnce(constructorSpy);
  Sinon.assert.calledOnce(connectSpy);
  Sinon.assert.notCalled(disconnectSpy);

  el.removeAttribute("flow-controller");
  await aTimeout(1);

  Sinon.assert.calledOnce(constructorSpy);
  Sinon.assert.calledOnce(connectSpy);
  Sinon.assert.calledOnce(disconnectSpy);

  application.stop();
});
