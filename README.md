# Kinegram 2.0

A Kinegram _[Barrier grid animation / Scanimation / Moiré Animation]_ is a method of creating animation cheaply and in a static form. [See more about it here.](https://en.wikipedia.org/wiki/Barrier_grid_animation_and_stereography)

Drag and drop images onto the canvas to generate your own, then export files to print them out.

## To run

Install dependences

```
npm install
```

Run locally

```
npm run dev
```

## Whats new

This new version of Kinegram brings a lot more control to the interface. As well as general performance upgrades, you now have the ability to change various settings to both the actual process of the animation but also things like the playback.

Also, the ability to export full colour kinegrams! And also circular kinegrams! The excitement is palpable

## Roadmap

- Push the generation of the site onto a webworker. I couldn't work out all of the work to do with transferring a canvas context, PRs would be greatly appreciated
- Create a CLI version of tool, to use offline
