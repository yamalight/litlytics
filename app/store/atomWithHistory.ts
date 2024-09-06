// Source: https://github.com/jotaijs/jotai-history/blob/main/src/atomWithHistory.ts
// for some reason it's not part of jotai even though docs say it is

import type { Atom } from 'jotai/vanilla';
import { atom } from 'jotai/vanilla';

/**
 * @param targetAtom an atom or derived atom
 * @param limit the maximum number of history states to keep
 * @returns an atom with an array of history states
 */
export function atomWithHistory<T>(targetAtom: Atom<T>, limit: number) {
  const refAtom = atom(
    () => ({ history: [] as T[] }),
    (get) => () => void (get(refAtom).history.length = 0)
  );
  refAtom.onMount = (mount) => mount();
  refAtom.debugPrivate = true;
  return atom((get) => {
    const ref = get(refAtom);
    return (ref.history = [get(targetAtom), ...ref.history].slice(0, limit));
  });
}
