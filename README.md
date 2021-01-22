# FBL Plugins: HTML to Image

Allows to convert any HTML document into image inside [fbl](https://fbl.fireblink.com) flow.

[![Tests](https://github.com/FireBlinkLTD/fbl-plugins-html-to-img/workflows/Tests/badge.svg)](https://github.com/FireBlinkLTD/fbl-plugins-html-to-img/actions?query=workflow%3ATests)
[![Known Vulnerabilities](https://snyk.io/test/github/FireBlinkLTD/fbl-plugins-html-to-img/badge.svg)](https://snyk.io/test/github/FireBlinkLTD/fbl-plugins-html-to-img)
[![codecov](https://codecov.io/gh/FireBlinkLTD/fbl-plugins-html-to-img/branch/master/graph/badge.svg)](https://codecov.io/gh/FireBlinkLTD/fbl-plugins-html-to-img)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/FireBlinkLTD/fbl-plugins-html-to-img.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/FireBlinkLTD/fbl-plugins-html-to-img/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/FireBlinkLTD/fbl-plugins-html-to-img.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/FireBlinkLTD/fbl-plugins-html-to-img/context:javascript)

## Integration

There are multiple ways how plugin can be integrated into your flow.

### package.json

This is the most recommended way. Create `package.json` next to your flow file with following content:

```json
{
  "name": "flow-name",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    "fbl": "fbl"
  },
  "license": "UNLICENSED",
  "dependencies": {
    "@fbl-plugins/html-to-img": "1.0.0",
    "fbl": "1.9.2"
  }
}
```

Then you can install dependencies as any other node module `yarn install` depending on the package manager of your choice.

After that you can use `yarn fbl <args>` to execute your flow or even register a custom script inside "scripts".

### Global installation

`npm i -g @fbl-plugins/html-to-img`

### Register plugin to be accessible by fbl

- via cli: `fbl -p @fbl-plugins/html-to-img <args>`
- via flow:

```yaml
requires:
  fbl: '>=1.9.2'
  plugins:
    '@fbl-plugins/html-to-img': '>=1.0.0'

pipeline:
  # your flow goes here
```

## Documentation

Read more [here](docs/README.md).
