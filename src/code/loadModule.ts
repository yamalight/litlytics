export async function loadModule(code: string) {
  return import(
    /* webpackIgnore: true */ 'data:text/javascript;base64,' + btoa(code)
  ).then((mod) => mod.default);
}
