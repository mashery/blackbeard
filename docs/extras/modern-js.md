# Working with Modern JavaScript

Blackbeard is a dependency-free Portal platform running on modern JavaScript APIs. It's possible to build a beautiful, modern looking site without using bloated libraries like jQuery.

To push support back to IE 9 without the need for [precompilers like Babel](https://babeljs.io/), Blackbeard includes [polyfills](https://remysharp.com/2010/10/08/what-is-a-polyfill) that extend modern functionality back to older browsers.

The included polyfills:

- `after()`
- `append()`
- `Array.forEach()`
- `before()`
- `classList`
- `closest()`
- `CustomEvent`
- `matches()`
- `nodeList.forEach()`
- `Object.forEach()` (*not part of spec but works just like `Array.forEach()` and `nodeList.forEach()`*)
- `Object.keys()`
- `prepend()`
- `remove()`
- `requestAnimationFrame()`

Feel free to add your own, or use a service like [polyfill.io](https://polyfill.io) to extend support even further. There's also an robust [JavaScript API](/docs/read/customizing/API) for handling many common tasks.