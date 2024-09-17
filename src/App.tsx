import { Route, Router } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { ErrorBoundary, type ParentComponent } from "solid-js";

import Navbar from "./Navbar";
import Home from "./pages/Home";

const client = new QueryClient();

const RootLayout: ParentComponent = (props) => (
  <>
    <Navbar />
    {props.children}
  </>
);

export const App = () => {
  return (
    <ErrorBoundary fallback={<div>Something went wrong!</div>}>
      <QueryClientProvider client={client}>
        <Router root={RootLayout}>
          <Route path="/" component={Home} />
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
