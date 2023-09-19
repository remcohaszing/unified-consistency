import { generateDifferences, showInvisibles } from 'prettier-linter-helpers'
import { type Plugin } from 'unified'
import { location } from 'vfile-location'

const source = 'unified-consistency'
const url = `https://github.com/remcohaszing/${source}`

/**
 * A unified plugin which reports inconsistencies between the input and what a pipeline would
 * output.
 */
const unifiedConsistency: Plugin = function unifiedConsistency() {
  return (ast, file) => {
    const original = String(file)
    const formatted = String(this.stringify(ast, file))

    const differences = generateDifferences(original, formatted)
    const { toPoint } = location(original)

    for (const { deleteText = '', insertText = '', offset, operation } of differences) {
      const toDelete = `\`${showInvisibles(deleteText)}\``
      const toInsert = `\`${showInvisibles(insertText)}\``
      const start = toPoint(offset)!
      const end = toPoint(offset + deleteText.length)!
      const position = { start, end }

      const message =
        operation === generateDifferences.DELETE
          ? file.message(`Delete ${toDelete}`, {
              place: position,
              ruleId: 'delete',
              source
            })
          : operation === generateDifferences.REPLACE
          ? file.message(`Replace ${toDelete} with ${toInsert}`, {
              place: position,
              ruleId: 'replace',
              source
            })
          : file.message(`Insert ${toInsert}`, {
              place: start,
              ruleId: 'insert',
              source
            })

      message.url = url
      message.expected = [insertText]
    }
  }
}

export default unifiedConsistency
