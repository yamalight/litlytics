export async function loadModule(code: string) {
  return import(
    /* @vite-ignore */ 'data:text/javascript;base64,' + btoa(code)
  ).then((mod) => mod.default);
}
