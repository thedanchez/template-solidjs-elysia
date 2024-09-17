import { render } from "solid-js/web";

import { App } from "./App";

async function enableMocking() {
  if (import.meta.env.VITE_MSW !== "true") return;

  const { worker } = await import("./mocks/browser");
  const apiUrl = `${location.origin}/api`;

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start({
    onUnhandledRequest: (req) => {
      console.log("Found an unhandled request:", req);

      if (req.url.startsWith(apiUrl)) {
        console.error("Found an unhandled API %s request to %s", req.method, req.url);
      }
    },
  });
}

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

enableMocking().then(() => {
  render(() => <App />, root!);
});
