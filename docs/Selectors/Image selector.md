# Image selector
Image selector can extract `src` attribute (URL) of an image. 
Optionally you can also store the images. The images will be stored in your
downloads directory:

`Downloads/<sitemap-id>/<selector-id>/<image filename.jpg>`

Note! When selecting CSS selector for image selector all the images within the
site are moved to the top. If this feature somehow breaks sites layout please
report it as a bug.

## Configuration options
 * selector - [CSS selector] [css-selector] for the image.
 * multiple - multiple records are being extracted.
 * download image - downloads and store images on local drive. When CouchDB
 storage back end is used the image is also stored locally.
 * delay - delay before element selection.

## Use cases
See [Text selector] [text-selector] use cases.

 [text-selector]: text-selector.md