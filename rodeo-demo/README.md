# Rodeo Road Log — demo

A runnable preview of the barrel-racing tracker (log runs & times, compare
arenas, and keep notes on hotels/campgrounds on the road).

## How to open it

Just double-click **`index.html`** (or drag it into a web browser). No install,
no build step. You'll need an internet connection the first time so it can load
React, the icons, and Tailwind from a CDN.

It opens pre-filled with a few sample runs, arenas, and stays so you can see what
the app looks like with real data in it.

## Good to know

- **Your data is saved in the browser** (via `localStorage`) on the device you
  open it on. It stays between visits, but it isn't synced to the cloud or to
  another device yet.
- To wipe it back to the sample data, clear this page's site data in your
  browser, or open your browser's dev console and run `localStorage.clear()`
  then refresh.

## What changed from the original

This started as a Claude Artifact (`barrellog.jsx`). Two things were adapted so
it runs as a plain web page:

1. The original saved data through Claude's `window.storage` API, which only
   exists inside a Claude Artifact. That's replaced with a small
   `localStorage`-backed stand-in.
2. React, the `lucide-react` icons, and Tailwind CSS are loaded from a CDN and
   the JSX is compiled in the browser, so there's nothing to install.

The actual app code (the screens, the layout, the styling) is unchanged.

## Turning this into a real app later

When you're ready to make this a "real" installable app — cloud sync so runs
show up on your phone and your daughter's phone, video uploads instead of pasted
links, etc. — this demo is a great starting point. Happy to help wire it into a
proper project when you want to take that step.
