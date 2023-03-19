import assert from 'node:assert/strict'
import { test } from 'node:test'

import { remark } from 'remark'
import { VFileMessage } from 'vfile-message'

import unifiedConsistency from './index.js'

test('delete', () => {
  const processor = remark().use(unifiedConsistency)
  const vfile = processor.processSync('# hello\n\n')

  assert.deepEqual(vfile.messages, [
    Object.assign(
      new VFileMessage(
        'Delete `⏎`',
        {
          start: { line: 2, column: 1, offset: 8 },
          end: { line: 3, column: 1, offset: 9 }
        },
        'unified-consistency:delete'
      ),
      {
        expected: [''],
        fatal: false,
        url: 'https://github.com/remcohaszing/unified-consistency'
      }
    )
  ])
})

test('equal', () => {
  const processor = remark().use(unifiedConsistency)
  const vfile = processor.processSync('# hello\n')

  assert.deepEqual(vfile.messages, [])
})

test('insert', () => {
  const processor = remark().use(unifiedConsistency)
  const vfile = processor.processSync('# hello')

  assert.deepEqual(vfile.messages, [
    Object.assign(
      new VFileMessage(
        'Insert `⏎`',
        { column: 8, line: 1, offset: 7 },
        'unified-consistency:insert'
      ),
      {
        expected: ['\n'],
        fatal: false,
        url: 'https://github.com/remcohaszing/unified-consistency'
      }
    )
  ])
})

test('replace', () => {
  const processor = remark().use(unifiedConsistency)
  const vfile = processor.processSync('#hello')

  assert.deepEqual(vfile.messages, [
    Object.assign(
      new VFileMessage(
        'Replace `#hello` with `\\#hello⏎`',
        {
          start: { line: 1, column: 1, offset: 0 },
          end: { line: 1, column: 7, offset: 6 }
        },
        'unified-consistency:replace'
      ),
      {
        expected: ['\\#hello\n'],
        fatal: false,
        url: 'https://github.com/remcohaszing/unified-consistency'
      }
    )
  ])
})
