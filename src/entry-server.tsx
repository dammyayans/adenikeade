import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';

export function render(url: string) {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
}

export { caseStudies } from './data/caseStudies';
// The prerenderer builds each document's <head> from these, so a static file
// and the running app are fed by one definition of what a route is called.
export { routes, metaFor, notFoundMeta, abs, ORIGIN } from './data/meta';
export { headTags } from './data/head';
