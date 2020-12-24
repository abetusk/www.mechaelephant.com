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

Quick Use
---

```
notenox -T mynote \
  -K 'note ; notes ; example' \
  -k 'note taking' \
  -l 'http://example.com' \
  -l 'http://example.com/note' \
  -n "this is an example note"
```

Will produce:

```
{
  "id": "e1277ad4-30c5-6af3-89ee-7ca1bd800012",
  "timestamp": 1608835311.392,
  "keyword": [
    "title:mynote",
    "note",
    "notes",
    "example",
    "note taking"
  ],
  "extra": [],
  "note": "this is an example note",
  "link": [
    "http://example.com",
    "http://example.com/note"
  ]
}
```

You can then save this to a file for later processing.

Description
---

User specified fileds are generally the note, zero or more links and zero or more keywords.
Keywords are cross referenced so that all notes with the given keyword can be viewed.

Each entry is given a unique ID along with a timestamp (seconds since epoch).
The `link`, `keyword` and `extra` field are arrays which can have zero or more entries.



The `title:` prefix added to keywords by using the `-T` command line option to specifiy a keyword
(without the `title:` prefix explicitely specified).
The `title` keywords are grouped differently in the viewer, with the list of titles displayed
in reverse chronological order since last update.
Clicking on the title keyword in the viewer wil show all entries in reverse created chronological order.

This follows much the same usage pattern as an email client, with a 'thread' of notes folded
under a `title` and the last one to be updated floating to the top.

The viewer displays keywords, under the title, along with their frequencies and in reverse frequency
order.

Motivation
---

I find myself using email to keep notes on various pages I find on the web.
Instead of relying on my Gmail account, I wanted something that I had more control
over.

The size of the data is relatively small, even after years of note keeping,
so creating a web page interface that keeps the notes in memory is feasible
and opens the possibility of using more complex searches.

In following with the Zettelkasten idea, each entry has the possibility
to have different keywords added to it with a 'privileged' `title` keyword
prefix that mimics the organization using email as a note keeping device.
That is, the `title` prefix groups entries under a given `title` as well
as sorting titles by most recently added to.

Since I primarily use the command line, I created a command line tool
to create notes, with some small functionality to allow for easy
keyword addition, title creation and save ability.

Notes can be accessed by loading the web page that loads a JSON
"database" file of all the notes into memory for ease of viewing.

Entries themselves are kept in a separate directory as simple JSON
files.
The database is created by processing all entries into the single
JSON database file.


Web Viewer
---

First, notes must be collected into a single file for download:

```
./notenox-org > html/data/notenox-db.json
```

To test, start a web browser in the `html` directory:

```
cd html
python -m SimpleHTTPServer
```

Navigating to `http://localhost:8000` should provide you with
a page to navigate all entries.

Configuration
---

Currently, `notenox` looks in `$HOME/.config/notenox/notenox.conf` for a configuration file.

The configuration file can have the following parameters (defaults listed below):

```
{
  "debug" : false,
  "silent": false,
  "save" : false,
  "out_dir": "./"
};
```

* `debug` - show debugging information
* `silent` - do not print out note
* `save` - save to disk
* `out_dir` - output directory to save entry to



Usage
---

```
version: 0.1.0

usage:

    notenox [-h] [-v] [-n note] [-t timestamp] [-k keyword] [-l link] [-e extra] [_note]

  [-n|--note note ]           note (ignored if _note specified)
  [-t|--timestamp timestamp]  timestamp (seconds UTC, defaults to now)
  [-k|--keyword keyword]      keyword (can be specified multiple times)
  [-K keywords]               add list of keywords (seperated by';')
  [-l|--link link]            link (can be specified multiple times)
  [-e|--extra extra ]         extra information (can be specified multiple times)
  [-T|--title titlename]      add special 'title' keyword to keyword (append extra keyword 'title:<titlename>' to keywords
  [-u|--id id]                set ID (defaults to random)
  [-s]                        silent (don't print out note)
  [-S]                        save note (unimplemented)
  [-c <cfgfile>]              specify config file (default /home/abe/.config/notenox/notenox.conf)
  [-D]                        debug output
  [-h]                        show help (this screen)
  [-v]                        show version
```

Data Format
---

Each note entry is stored as a separate JSON file.

The fields are:

* `id` - a GUID
* `timestamp` - seconds since epoch (with millisecond rational part)
* `note` - note associated with entry
* `keyword[]` - array of keywords (the `title:` prefix has a privileged interpretation, see above)
* `link[]` - array of links
* `extra[]` - array of 'extra' information that might need to be kept on the entry

---

In most circumstances, only the `note`, `keyword` and `link` entries will be updated.

The entries in the `link` array will be interpreted as links in the viewer.

The entries in the `keyword` array will be grouped, except for the keywords with the `title:` prefix,
which will be interpreted differently by the viewer.

---

By design, the data is relatively simple and free form.
The different fields are there so that the viewer
has an indication of how to format the data.

---

Here is an example note:


```
{
  "id": "e1277ad4-30c5-6af3-89ee-7ca1bd800012",
  "timestamp": 1608835311.392,
  "keyword": [
    "title:mynote",
    "note",
    "notes",
    "example",
    "note taking"
  ],
  "extra": [],
  "note": "this is an example note",
  "link": [
    "http://example.com",
    "http://example.com/note"
  ]
}
```


License
---

To the extent possible under law, the person who associated CC0 with
this source code has waived all copyright and related or neighboring rights
to this source code.

You should have received a copy of the CC0 legalcode along with this
work.  If not, see [cc0](http://creativecommons.org/publicdomain/zero/1.0/).


