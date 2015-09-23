# Sierpinski Triangle
This single-page application shows a Sierpinski Triangle, where it is possible
to freely zoom and pan undefinitly.


# My current thoughts
In this section I will display what I am thinking during at the moment of the
last commit.

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

## Infinite zooming and panning
As one of the requirements is to be able to zoom infinitely. I need to find a
good way to do this, without comprimising the user experience with slowed down
renders or laggy moments. It has to be smooth experience of scrolling
infinitely.

### Initial implementation (Brute force)
The initial attempt was to construct a Master Triangle that would divide in
three triangles recursively. The problem is that this algorithm scales very
badly. The time complexity is O(3^x), being x the number of recursions.

### Only divide the triangles in viewport.
A possibility would be to only divide the triangles in the current viewport,
reducing unnecessary processing time. However, this still has two problems:

1. It would not scale infinitely, as if someone was able to zoom infinitely,
it will consume all the memory and slow down the application.

2. It would still take some time to create/remove the new needed triangles,
which may affect the performance and user experience.
  * A possible solution to this could be the use of WebWorkers to handle the
  needed processing. Using WebWorkers would free the main JS eventloop thread
  to do the actual zooming, panning and orchestation.

### Caching `triangles` and moving them as needed.
As the Sierpinski Triangle fractal is formed by a repetitive pattern. It might
be possible to cache a certain amount of Triangles, enough to display nicely
in the screen.

When the user tries to zoom in or pan, the triangles that go out
of the viewport could be moved and scaled properly to give the impression of
new elements being created.

The only problem of this approach is that the complexity is moved from the
CPU/Memory to the design of the fetching and moving algorithms.


# Roadmap
* Zoom and Pitch.
* Set up testing environment.
* Refactor modules (Maybe using ES2015 classes?).
