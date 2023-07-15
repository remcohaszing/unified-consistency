import { generateDifferences, showInvisibles } from 'prettier-linter-helpers'
import { Plugin } from 'unified'
import { location } from 'vfile-location'

const source = 'unified-consistency'
const url = `https://github.com/remcohaszing/${source}`
const del = `${source}:delete`
const insert = `${source}:insert`
const replace = `${source}:replace`

/**
 * A unified plugin which reports inconsistencies between the input and what a pipeline would
 * output.
 */
const unifiedConsistency: Plugin<[]> = function unifiedConsistency() {
  return (ast, file) => {
    const original = String(file)
    const formatted = String(this.stringify(ast, file))

    const differences = generateDifferences(original, formatted)
    const { toPoint } = location(original)

    for (const { deleteText = '', insertText = '', offset, operation } of differences) {
      const toDelete = `\`${showInvisibles(deleteText)}\``
      const toInsert = `\`${showInvisibles(insertText)}\``
      const position = {
        start: toPoint(offset),
        end: toPoint(offset + deleteText.length)
      }

      const message =
        operation === generateDifferences.DELETE
          ? file.message(`Delete ${toDelete}`, position, del)
          : operation === generateDifferences.REPLACE
          ? file.message(`Replace ${toDelete} with ${toInsert}`, position, replace)
          : file.message(`Insert ${toInsert}`, position.start, insert)

      message.url = url
      message.expected = [insertText]
    }
  }
}

export default unifiedConsistency
