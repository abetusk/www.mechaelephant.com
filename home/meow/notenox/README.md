`notenox`
===

This is an attempt to create a small note or bookmark
collection inspired a little by the Zettelkasten
method.

The notes themselves should be small and lightweight.
Creating notes should be lightweight because if it isn't,
it'll be hard to keep up with it.

Here is a first attempt:

* Each note is stored as JSON data
* Each note consists of a timestamp (of entry), a link (or collection of links),
  a note (optional) and a list of keywords (and a 'extra' array for extra options)
* A special keyword type is specified by a prefix of `<grouping>:` to simulate
  an email thread, say (so `music_notes:`, say)
* A command line tool is available to easily generate notes



Here is an example note:

```
{
  "note":"music notes",
  "timestamp": 1608219871,
  "keyword" : [ "music", "sound" ],
  "link" : [ "https://example.com" ],
  "extra": [ "markdown" ]
}
```

Maybe with the `extra` field denoting that the `note` field should be rendered in Markdown.
`timestamp` is in seconds (UTC).


---

The rendering site should allow for different views of the data to sort and sift.
The data itself should be readily downloadable for ease of processing.


