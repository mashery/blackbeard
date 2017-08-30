Blackbeard supports [GitHub-flavored Markdown](https://github.github.com/gfm/) for documentation and custom pages.

*__Note:__ To use markdown, you MUST disable TinyMCE by unchecking "Use TinyMCE" in Control Center. If you ever edit a page written in markdown with TinyMCE enabled, it will wrap your content in paragraph elements and break your page, preventing markdown from rendering.*

## Disabling Markdown

Markdown support is enabled for documentation and custom pages by default. You can disable it Portal-wide by setting the `markdown` Portal option to `false`.

```js
portalOptions.markdown = false;
```

You can also disable it on a page-by-page basis by setting a global option for `noMarkdown` anywhere in your content.

```html
<script>
    mashery.globals.noMarkdown = true;
</script>
```

## Paragraphs

Paragraphs are just **one or more lines of consecutive text** followed by one or more blank lines.

```md
On July 2, an alien mothership entered Earth's orbit and deployed several dozen
saucer-shaped "destroyer" spacecraft, each 15 miles (24 km) wide.

On July 3, the Black Knights, a squadron of Marine Corps F/A-18 Hornets,
participated in an assault on a destroyer near the city of Los Angeles.
```

## Headings

You can create a heading by adding one or more `#` symbols before your heading text. The number of `#` you use will determine the size of the heading.

```md
# The largest heading (an H1 tag)
## The second largest heading (an H2 tag)
###### The 6th largest heading (an H6 tag)
```

The space between `#` and the heading text is not required. You can wrap the headings in `#`. Both leading and trailing `#` will be removed.

```md
## My Heading ##
```

If, for some reason, you need to keep a leading or trailing `#`, you can either add a space or escape it:

```md
# # My header # #

#\# My Header \# #
```


### Header IDs

Blackbeard markdown automatically generates header IDs.

```md
# My cool header with ID
```

```html
<h1 id="mycoolheaderwithid">My cool header with ID</h1>
```

## Blockquotes

You can indicate blockquotes with a `>`.

```md
In the words of Abraham Lincoln:

> Pardon my french
```

Blockquotes can have multiple paragraphs and can have other block elements inside.

```md
> A paragraph of text
>
> Another paragraph
>
> - A list
> - with items
```

## Bold and Italic

You can make text bold or italic.

```md
*This text will be italic*
**This text will be bold**
```

Both bold and italic can use either a `*` or an `_` around the text for styling. This allows you to combine both bold and italic if needed.

```md
**Everyone _must_ attend the meeting at 5 o'clock today.**
```

## Strikethrough

Like GitHub, Blackbeard supports strikethrough elements by adding two tilde (`~~`) characters around
a word or groups of words.

```md
a ~~strikethrough~~ element
```

a ~~strikethrough~~ element

## Code formatting

### Inline formats

Use single backticks (`) to format text in a special monospace format. Everything within the backticks appear as-is, with no other special formatting.

```md
Here's an idea: why don't we take `SuperiorProject` and turn it into `**Reasonable**Project`.
```

```html
<p>Here's an idea: why don't we take <code>SuperiorProject</code> and turn it into <code>**Reasonable**Project</code>.</p>
```

### Multiple lines

To create blocks of code you can indent it by four spaces.

```
    this is a piece
    of
    code
```

You can also use triple backticks (```) to format text as its own distinct block.

    Check out this neat program I wrote:

    ```
    x = 0
    x = 2 + 2
    what is x
    ```

You can specify a language after the triple backticks, and Blackbeard will automatically add syntax highlighting.

	```javascript
	var thing1 = document.querySelector('.thing2');
	```

```javascript
var thing1 = document.querySelector('.thing2');
```

## Lists

Blackbeard markdown supports ordered (numbered) and unordered (bulleted) lists.

### Unordered lists

You can make an unordered list by preceding list items with either a `*`, a `-` or a `+`. Markers are interchangeable too.

```md
* Item
+ Item
- Item
```

### Ordered lists

You can make an ordered list by preceding list items with a number.

```md
1. Item 1
2. Item 2
3. Item 3
```

It’s important to note that the actual numbers you use to mark the list have no effect on the HTML output Blackbeard markdown produces. So you can use the same number in all items if you wish to.

### TaskLists

Blackbeard markdown also supports GitHub styled takslists.

```md
 - [x] checked list item
 - [ ] unchecked list item
```

 - [x] checked list item
 - [ ] unchecked list item

### Nested blocks

List items may consist of multiple paragraphs. Each subsequent paragraph in a list item must be indented by either 4 spaces or one tab:

```md
1.  This is a list item with two paragraphs. Lorem ipsum dolor
    sit amet, consectetuer adipiscing elit. Aliquam hendrerit
    mi posuere lectus.

    Vestibulum enim wisi, viverra nec, fringilla in, laoreet
    vitae, risus. Donec sit amet nisl. Aliquam semper ipsum
    sit amet velit.

2.  Suspendisse id sem consectetuer libero luctus adipiscing.
```

This is valid for other block elements such as blockquotes:

```md
*   A list item with a blockquote:

    > This is a blockquote
    > inside a list item.
```

Or even other lists.

### Nested lists

You can create nested lists by indenting list items by **four** spaces.

```md
1.  Item 1
    1. A corollary to the above item.
    2. Yet another point to consider.
2.  Item 2
    * A corollary that does not need to be ordered.
    * This is indented four spaces
    * You might want to consider making a new list.
3.  Item 3
```

To nest a third (or more) sublist level, you need to indent 4 extra spaces (or 1 extra tab) for each level.

```
1.  level 1
    1.  Level 2
        *   Level 3
    2.  level 2
        1.  Level 3
1.  Level 1
```

### Nested code blocks

You can nest fenced codeblocks the same way you nest other block elements, by indenting by fours spaces or a tab:

```md
1.  Some code:

    ```js
    var foo = 'bar';
    console.log(foo);
    ```
```

To put a *indented style* code block within a list item, the code block needs to be indented twice&mdash;8 spaces or two tabs:

```md
1.  Some code:

    var foo = 'bar';
    console.log(foo);
```

## Links

### Simple

Blackbeard markdown will automagically turn every valid URL it finds in the text body to links for you.

```md
link to http://www.google.com/

this is my email somedude@mail.com
```

### Inline

You can create an inline link by wrapping link text in brackets ( `[ ]` ), and then wrapping the link in parentheses ( `( )` ).

For example, to create a hyperlink to github.com/mashery/blackbeard, with a link text that says, Get Blackbeard!, you'd write this in Markdown: `[Get Blackbeard!](https://github.com/mashery/blackbeard)`.

## Images

Markdown uses an image syntax that is intended to resemble the syntax for links.

```
![Alt text](url/to/image)

![Alt text](url/to/image "Optional title")
```

That is:

-  An exclamation mark: !;
- followed by a set of square brackets, containing the alt attribute text for the image;
- followed by a set of parentheses, containing the URL or path to the image, and an optional title attribute enclosed in double or single quotes.


## Tables

Blackbeard markdown makes writing tables super easy.

Colons can be used to align columns. The outer pipes (`|`) are optional. You also don't need to make the raw Markdown line up prettily. You can use other markdown syntax inside them.

```
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| **col 3 is**  | right-aligned | $1600 |
| col 2 is      | *centered*    |   $12 |
| zebra stripes | ~~are neat~~  |    $1 |
```

## Escaping markdown entities

Blackbeard allows you to use backslash (`\`) escapes to generate literal characters which would otherwise have special meaning in markdown’s syntax. For example, if you wanted to surround a word with literal underscores (instead of an HTML `em` tag), you can use backslashes before the unserscores, like this:

```md
\_literal underscores\_
```

Blackbeard provides backslash escapes for the following characters:

```
\   backslash
`   backtick
*   asterisk
_   underscore
{}  curly braces
[]  square brackets
()  parentheses
#   hash mark
+   plus sign
-   minus sign (hyphen)
.   dot
!   exclamation mark
```


## Handling HTML in markdown documents

Blackbeard markdown, in most cases, leaves HTML tags alone, leaving them untouched in the output document.

```md
some markdown **here**
<div>this is *not* **parsed**</div>
```

```html
<p>some markdown <strong>here</strong></p>
<div>this is *not* **parsed**</div>
```

However, there are exceptions to this. With `code` and `pre` tags, their contents are always escaped.

If you wish to enable markdown parsing inside a specific HTML tag, you can enable it by using the html attribute **`markdown`** or  **`markdown="1"`**  or **`data-markdown="1"`**.

```md
some markdown **here**
<div markdown="1">this is *not* **parsed**</div>
```

```html
<p>some markdown <strong>here</strong></p>
<div markdown="1"><p>this is <em>not</em> <strong>parsed</strong></p></div>
```