# Rodeo Road Log — demo

A runnable preview of the barrel-racing tracker: log runs & times, compare
arenas, and keep notes on hotels/campgrounds on the road.

## Two ways to see it

**1. Click the hosted link** (easiest — nothing to download)

> https://claude.ai/code/artifact/322895e2-e05b-4ea5-9c51-8bb978d50d04

Opens the app in your browser on any device.

**2. Open the file on your computer**

Note: clicking `index.html` *on GitHub* only shows the code — GitHub doesn't run
web pages. To actually see the app, get the file onto your computer first:

- On the GitHub page for `index.html`, click **"Download raw file"** (the
  download icon near the top-right of the file view).
- Then **double-click the downloaded file** — it opens in your browser and runs.

It works completely offline — no internet needed.

## Good to know

- It opens pre-filled with a few sample runs, arenas, and stays so you can see
  what the app looks like with real data in it.
- **Your data is saved in the browser** (via `localStorage`) on whatever device
  you open it on. It stays between visits, but it isn't synced to the cloud or to
  another device yet.
- To reset it back to the sample data: open your browser's dev console and run
  `localStorage.clear()`, then refresh.

## What this is

This started as a Claude Artifact (`barrellog.jsx`, a React component). It's been
rebuilt here as a single self-contained web page — plain HTML, CSS, and
JavaScript with no build step and no external dependencies — so it runs anywhere
just by opening it. The look, screens, and layout match the original.

## Turning this into a real app later

When you're ready to make this a "real" installable app — cloud sync so runs show
up on your phone and your daughter's phone, real video uploads instead of pasted
links, etc. — this demo is a great starting point. Happy to help build that when
you want to take the next step.
