import React from "react";
import { getStore, getStoreActions } from "./runtime";

export function useStoreSnapshot(selector = (snapshot) => snapshot) {
  const selectorRef = React.useRef(selector);
  const lastSelectorRef = React.useRef(selector);
  const lastStoreSnapshotRef = React.useRef(null);
  const lastSelectedSnapshotRef = React.useRef(null);

  selectorRef.current = selector;

  function readSnapshot() {
    const storeSnapshot = getStore().getSnapshot();
    const nextSelector = selectorRef.current;

    if (
      lastStoreSnapshotRef.current !== storeSnapshot ||
      lastSelectorRef.current !== nextSelector
    ) {
      lastStoreSnapshotRef.current = storeSnapshot;
      lastSelectorRef.current = nextSelector;
      lastSelectedSnapshotRef.current = nextSelector(storeSnapshot);
    }

    return lastSelectedSnapshotRef.current;
  }

  return React.useSyncExternalStore(
    (listener) => getStore().subscribe(listener),
    readSnapshot,
    readSnapshot,
  );
}

export function useStoreActions() {
  return getStoreActions();
}
