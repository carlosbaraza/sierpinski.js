[![Build status](http://arm.carlosbaraza.com/ci/projects/1/status.png?ref=develop)]
(http://arm.carlosbaraza.com/ci/projects/1?ref=develop)

# ![Logo](client/images/logo-128.png?raw=true) Sierpinski.JS
This single-page application shows a Sierpinski Triangle, where it is possible
to freely zoom and pan infinitely.


# Roadmap 1.0
* ~~Setup development environment~~
  * ~~Gulp build tasks~~
  * ~~ES2015~~
  * ~~Sass~~
  * ~~Auto browser reload for reactive programming~~
* ~~Setup testing environment.~~
  * ~~Gulp test builds~~
  * ~~Karma~~
  * ~~Mocha && Chai / Jasmine~~
  * ~~CI~~
* ~~Represent simple Sierpinski Triangle~~
  * ~~Basic file structure~~
* Zoom and Pitch.
  * ~~Basic implementation~~
  * ~~Mobile pinch and pan experience~~
  * Acceleration-based zoom and pan to improve UX.
* ~~Refactor modules~~
  * ~~Rename files and reorganize.~~
  * ~~Maybe use ES2015 classes?~~
* Infinite zoom and pan
  * ~~Cull non-visible elements~~
  * ~~Split and merge~~
    * ~~Split visible triangles until optimal amount of triangles in screen.~~
    * ~~Split newly visible triangles to same split degree.~~
    * ~~Merge triangles when zooming out.~~
  * ~~Optimize performance. Using simpler Sierpinski Triangle as basic drawing
    element.~~
  * ~~Optimize performance. Move culling, splitting and merging to workers.~~
  * Workaround scale limit of 48E11 for infinite zoom.
* ~~Nice UI to control the app.~~
  * ~~Navigation bar with stats and links to GitLab and JSDoc~~
:  * Better mobile version
* Cool WebGL shaders to beautify the Sierpinski Triangle.

# Application schema
![Application schema](client/images/sierpinskijs-schema.png?raw=true)


# Main algorithm improvement history:

## 1. Initial implementation (Brute force)
The initial attempt was to construct a Master Triangle that would divide in
three triangles recursively. The problem is that this algorithm scales very
badly. The time complexity is `O(3^x)`, being x the number of recursions.

## 2. Only divide visible triangles.
A possibility would be to only divide the triangles in the current viewport,
reducing unnecessary processing time. However, this still has two problems:

1. It would not scale infinitely, as if someone was able to zoom infinitely,
it will consume all the memory and slow down the application.

2. It would still take some time to create/remove the new needed triangles,
which may affect the performance and user experience.
  * A possible solution to this could be the use of WebWorkers to handle the
  needed processing. Using WebWorkers would free the main JS eventloop thread
  to do the actual zooming, panning and orchestation.

## 3. Only divide visible triangles + Web Worker.
After the second implementation attempt, I realised that the performance was
acceptable enough, but it had, as predicted, some laggy moments while the
division/merge/culling scripts where running. As there are many elements,
this would take long time to execute, being O(n) time complexity operations.

In order to free the main JS event loop, I have moved the splitting, merging
and culling to a separate Event Loop thead, running on a web worker. This
improves a lot the UX, as there are no laggy moments anymore.

Some possible improvements:

* Reduce the amount of objects to divide, merge and cull using prebuilt and
cached Sierpinski Triangles, instead of basic triangles.

## 4. Only divide visible triangles + Web Worker + Sierpinski Caching.
As the Sierpinski Triangle fractal is formed by a repetitive pattern. It is
possible to construct a basic drawing element that will be a Sierpinski
triangle.

If we build and cache multiple basic Sierpinski triangles in advance during
the set up and we move them as needed, it will reduce the amount of actual
`PIXI.Graphics` objects in the scene, and so it will boost up the performance.

The way the worker `Grid` class is designed, it is independent from the
class of the object. It will just find the positions, widths and heights of
the visible elements. This allows the use of any basic drawing element,
including a Sierpinski triangle.


# My thoughts

## WebGL vs Canvas
I decided to use Pixi.JS, in contraposition with pure WebGL implementation. The
main reason is that Pixi.JS features a `canvas` fallback, in the scenarios where
WebGL is not available. This is specially useful for IE10, IE9 and mobile
browsers.

However, using Pixi.JS limites a lot the performance as currently each
`triangle` creates a complex pixi object, which encapsulates two TRIANGLE WebGL
primitive faces.

Having such a complex structure for thousands of triangles that are used in the
scene is an overhead. Each triangle could be reduced to one WebGL.TRIANGLE,
which is much simpler structure and will work much faster. The drawback would
be dropping Canvas, and so limiting the availability to users.

Final implementation includes PIXI.js.

## Infinite zooming and panning
As one of the requirements is to be able to zoom infinitely. I need to find a
good way to do this, without comprimising the user experience with slowed down
renders or laggy moments. It has to be smooth experience of scrolling
infinitely.

When positioning an element, a 64-bit Floating Point Number is used to track
the `x` position, `y` position and `scale`. When the scale/zoom augmentation is
very high, the position increments would become smaller, until reach the
minimum that the 64-bit Floating Point Number can increments. If such a zoom
level is reached, the application would become buggy. A limitation is set to
the zooming to prevent it.

There are ways to implement the zooming and positioning that would allow this
limit to be overpassed. However, as it is built into PIXI.JS, it would require
handling manually the PIXI scene scaling, loosing some of the PIXI.JS
optimizations. The main idea would be to reset the main stage scale after some
augmentations, and scale up the visible elements, keeping track of the
number of resets, in order to be able to zoom out.

# Setup environment
1. Clone this repository
2. Give execution permisions to bash script `chmod +x setup.sh`
3. Run the bash script `./setup.sh` to setup the environment

The script is basically doing
```bash
npm install bower
npm install gulp
npm install
./node_modules/bower/bin/bower install --allow-root
./node_modules/gulp/bin/gulp.js build
```

# Run development environment
This repository uses `browser-sync` to speed up the development. To run the
development environment:

```
gulp
```

# Build and Docs generation
```
gulp build
```

# Run the tests
To run once the tests:

```
gulp test
```

or to watch and rerun after modifications:

```
gulp tdd
```
