# unified-consistency

[![github actions](https://github.com/remcohaszing/unified-consistency/actions/workflows/ci.yaml/badge.svg)](https://github.com/remcohaszing/unified-consistency/actions/workflows/ci.yaml)
[![npm](https://img.shields.io/npm/v/unified-consistency)](https://www.npmjs.com/package/unified-consistency)
[![prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io)
[![codecov](https://codecov.io/gh/remcohaszing/unified-consistency/branch/main/graph/badge.svg)](https://codecov.io/gh/remcohaszing/unified-consistency)

A [unified](https://unifiedjs.com) plugin which reports inconsistencies between the input and what a
pipeline would output.

## Installation

```sh
npm install unified-consistency
```

## API

This unified plugin stringifies the AST, and reports any differences from the input. You should
always specify this plugin last. It works with all unified ecosystems, including
[remark](https://github.com/remarkjs/remark) and [rehype](https://github.com/rehypejs/rehype).

`processor.use(unifiedConsistency)`

### Options

This plugin has no options.

## Examples

### Configuration file

This plugin is best used in a
[configuration file](https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md). For
example:

```yaml
# .remarkrc.yaml
plugins:
  - unified-consistency
```

### Programmatic use

For example, the following script:

```js
import { remark } from 'remark'
import unifiedConsistency from 'unified-consistency'
import { reporter } from 'vfile-reporter'

const processor = remark().use(unifiedConsistency)

const file = await processor.process('#Hello')

console.log(reporter([file]))
```

Yields:

```
<stdin>
  1:1-1:7  warning  Replace `#Hello` with `\#Hello⏎`  replace  unified-consistency

⚠ 1 warning
```

### License

[MIT](LICENSE.md) @ [Remco Haszing](https://github.com/remcohaszing)
