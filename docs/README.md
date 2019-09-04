# HTML to Image Action Handler

Allows to render locally stored HTML document into PNG or JPEG image.

**ID:** `com.fireblink.fbl.plugins.html.to.img`

**Aliases:**

- `fbl.plugins.html.to.img`
- `html.to.img`
- `html->img`

```yaml
html->img:
  # [optional] maximum time to wait for page to load in seconds
  # Default value: 30 (30 seconds)
  # Min value: 1 second
  # Max value: 3600 seconds (1 hour)
  timeout: 45

  # [optional] function name on `window` object that page should call to start rendering,
  # e.g. window.iAmReady();
  # Note: function is added after page stops loading, so make sure to not call it right away.
  # E.g. `setTimeout(window.iAmReady, 1000);` will not work, while
  # setTimeout(() => {
  #   window.iAmReady();
  # }, 1000);
  # will probably work.
  readyFunction: iAmReady

  # [optional] browser viewport size to render the page and capture screenshot in
  viewport:
    # [optional] viewport width in pixels
    # default: 800
    width: 1024

    # [optional] viewport height in pixel
    # default: 600
    height: 800

    # [optional] device scale factor
    # default: 1
    deviceScaleFactor: 2

    # [optional] Whether the meta viewport tag is taken into account.
    # default: false
    isMobile: true

    # [optional] specifies if viewport is in landscape mode.
    # default: false
    isLandscape: true

  # [required] information on where to find the HTML file and related assets
  from:
    # [required] folder that contains html file and all assets (images, fonts, etc)
    folder: /some/folder

    # [required] relative path to the HTML file inside the folder
    relativePath: index.html

  # [required] image generation information
  img:
    # [required] path to where store the image file (should also iclude the name of the file and extension)
    path: screenshot.png

    # [optional] the screenshot type, can be either jpeg or png.
    # default: png
    type: jpeg

    # [optional] The quality of the image, between 0-100.
    # Not applicable to png images.
    quality: 90

    # [optional] when true, takes a screenshot of the full scrollable page.
    # default: false
    fullPage: true

    # [optional] an object which specifies clipping region of the page.
    clip:
      # [required] the x-coordinate of top-left corner
      x: 100

      # [required] the y-coordinate of top-left corner
      y: 100

      # [required] the width
      width: 256

      # [required] The height
      height: 128

    # [optional] hides default white background and allows capturing screenshots with transparency.
    # default: false
    omitBackground: true

    # [optional] the encoding of the image, can be either base64 or binary.
    # default: binary
    encoding: base64
```

**Warning:** headless Chrome browser is started with `--no-sandbox` and `--disable-setuid-sandbox` arguments, meaning sandbox is disabled. You should only use image rendering with the html content you trust.
