import { LitLytics } from 'litlytics';
/* eslint @typescript-eslint/ban-ts-comment: off */
export function createReactiveProxy(
  instance: LitLytics,
  updateCallback: () => void
) {
  return new Proxy(instance, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (typeof value === 'function') {
        // @ts-ignore
        return function (...args) {
          // @ts-ignore
          const result = value.apply(this, args);
          if (result instanceof Promise) {
            result.then(() => updateCallback.call(target));
          } else {
            updateCallback.call(target);
          }
          return result;
        };
      }
      return value;
    },
    // set(target, prop, value, receiver) {
    //   const result = Reflect.set(target, prop, value, receiver);
    //   updateCallback.call(target);
    //   return result;
    // },
  });
}
