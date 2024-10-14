import { LitLytics } from 'litlytics';
/* eslint @typescript-eslint/ban-ts-comment: off */

/**
 * Creates a Proxy wrapper around LitLytics instance to monitor function invocations
 * and update react state upon those invocations completion.
 * This is required because React cannot see changes in persistent object (i.e. wants new object refs)
 *
 * @param instance LitLytics instance
 * @param updateCallback callback to update state
 * @returns LitLytics instance with a proxy
 */
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
  });
}
