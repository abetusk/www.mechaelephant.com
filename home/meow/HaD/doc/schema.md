
### `post`

| Column | Datatype | Description |
|--------|----------|-------------|
| `post_id` | int | (primary key) Wordpress ID of post |
| `date` | datetime | Date of post |
| `date_gmt` | datetime | GMT Date of post |
| `guid` | varchar | Global Unique Identifier |
| `modified` | datetime | Modification date of post |
| `modified_gmt` | datetime | GMT modification date of post |
| `slug` | varchar | Human readable name |
| `type` | varchar | Type ("post") |
| `link` | varchar | URL |
| `title` | varchar | Title |
| `content` | varchar | HTML content |
| `excerpt` | varchar | Blog excerpt of content |
| `author` | int | Author ID |
| `featured_media` | int | ? |
| `category_post_id` | int | ... |
| `tag_post_id` | int | ... |

###### Indexes

* `(post_id)`
* `(date)`
* `(date_gmt)`
* `(slug)`

### `tag_post`

| Column | Datatype | Description |
|--------|----------|-------------|
| `tag_post_id` | int | primary key |
| `post_id` |  int | Post ID |
| `tag_id` | int | Tag ID |

###### Indexes

* `(tag_post_id)`
* `(tag_id)`
* `(tag_post_id, tag_id)`

### `category_post`

| Column | Datatype | Description |
|--------|----------|-------------|
| `category_post_id` | int | (primary key) |
| `post_id` | int | Post ID |
| `category_id` | int  | Category ID |

###### Indexes

* `(category_post_id)`
* `(category_id)`
* `(category_post_id, category_id)`

### `tag`

| Column | Datatype | Description |
|--------|----------|-------------|
| `tag_id` | int | (primary key) |
| `count` | int | Frequency count |
| `description` | varchar | Description of tag |
| `link` | varchar | Wordpress link to tag element |
| `name` | varchar | Name of tag |
| `slug` | varchar | Slug of tag |
| `taxonomy` | varchar |  |
| `self_url` | varchar |  |
| `collection_url` | varchar |  |
| `about_url` | varchar | |
| `wp_post_type_url` | varchar | |

###### Indexes

* `(tag_id)`
* `(name)`
* `(link)`
* `(slug)`

### `category`

| Column | Datatype | Description |
|--------|----------|-------------|
| `category_id` | int | (primary key) |
| `count` | int | Frequency count |
| `description` | varchar | |
| `link` | varchar | |
| `name` | varchar | |
| `slug` | varchar | |
| `taxonomy` | varchar | |

###### Indexes

* `(category_id)`
* `(name)`
* `(link)`
* `(slug)`


