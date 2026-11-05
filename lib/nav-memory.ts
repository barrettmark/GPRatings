"use client"

// Small per-tab memory so practice pages can lead back to the search that found them.
// sessionStorage can be unavailable (private mode), so every access is guarded;
// without it the back link falls back to the plain search page.

const LAST_SEARCH = "gpr-last-search"
const FROM_SEARCH = "gpr-from-search"

function get(key: string) {
  try {
    return window.sessionStorage.getItem(key)
  } catch {
    return null
  }
}

function set(key: string, value: string) {
  try {
    window.sessionStorage.setItem(key, value)
  } catch {
    // ignore
  }
}

export function rememberSearch(url: string) {
  set(LAST_SEARCH, url)
}

export function lastSearch() {
  return get(LAST_SEARCH)
}

/** Called when a search result is opened, so Back can use browser history (keeps scroll position). */
export function markFromSearch(code: string) {
  set(FROM_SEARCH, code)
}

export function cameFromSearch(code: string) {
  return get(FROM_SEARCH) === code
}
