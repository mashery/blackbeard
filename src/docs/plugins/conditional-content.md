# Conditional Content

Make some content on a page only visible to logged in or logged out users.

*__Note:__ If you want to hide an entire page, you're better served with the Page Visibility settings in Control Center. This component is best used for hiding pieces of content on an otherwise visible page.*

```html
<div class="hide-logged-in">
	This is only visible to logged out users.
</div>

<div class="hide-logged-out">
	This is only visible to logged in users.
</div>
```