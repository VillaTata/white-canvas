import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { AppContent } from "./App";

export function render() {
  return renderToString(
    <StaticRouter location="/">
      <AppContent />
    </StaticRouter>
  );
}
