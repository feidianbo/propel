import { h, render, rerender } from "preact";
import { assert, IS_WEB } from "../src/util";
import { enableFirebase } from "./db";
import { drainExecuteQueue, registerPrerenderedOutput } from "./nb";
import { Router } from "./pages";

assert(IS_WEB);

enableFirebase();

function cells() {
  const outputs = document.querySelectorAll(".output");
  for (let i = 0; i < outputs.length; i++) {
    registerPrerenderedOutput(outputs[i]);
  }
}

window.addEventListener("load", async() => {
  cells();

  render(h(Router, null), document.body, document.body.children[0]);

  await drainExecuteQueue();

  // If we're in a testing environment...
  if (window.navigator.webdriver) {
    // rerender to make sure the dom is up to date and then output a special
    // string which is used in tools/test_browser.js.
    rerender();
    console.log("Propel onload");
  }
});
