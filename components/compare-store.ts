"use client"

import { useSyncExternalStore } from "react"

// Practices picked for side-by-side comparison, kept per browser.
// Storage can be unavailable (private mode), so every access is guarded
// and the feature still works for the current page view.

const KEY = "gpr-compare"
export const MAX_COMPARE = 3

export type CompareItem = { code: string; name: string }

let items: CompareItem[] = []
let loaded = false
const listeners = new Set<() => void>()

function load() {
  if (loaded) return
  loaded = true
  try {
    const raw = window.localStorage.getItem(KEY)
    if (raw) items = JSON.parse(raw)
  } catch {
    items = []
  }
}

function save(next: CompareItem[]) {
  items = next
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // ignore: comparison still works until the page is closed
  }
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

const EMPTY: CompareItem[] = []

export function useCompare() {
  const list = useSyncExternalStore(
    subscribe,
    () => {
      load()
      return items
    },
    () => EMPTY,
  )
  return {
    items: list,
    has: (code: string) => list.some((i) => i.code === code),
    isFull: list.length >= MAX_COMPARE,
    toggle: (item: CompareItem) =>
      save(
        list.some((i) => i.code === item.code)
          ? list.filter((i) => i.code !== item.code)
          : list.length >= MAX_COMPARE
            ? list
            : [...list, item],
      ),
    remove: (code: string) => save(list.filter((i) => i.code !== code)),
    clear: () => save([]),
  }
}
