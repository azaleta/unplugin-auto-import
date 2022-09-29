import type { ImportNameAlias, ImportsMapContent } from './types'
import { IMPORT_EXCLUDE_PREFIX } from './types'

export function parseImport(presetName: string, importMap: ImportsMapContent) {
  const exclude: string[] = []
  const alias: Record<string, ImportNameAlias> = {}
  let hasInclude = false
  let hasExclude = false
  for (const val of importMap) {
    if (typeof val === 'string') {
      if (val.startsWith(IMPORT_EXCLUDE_PREFIX)) {
        hasExclude = true
        exclude.push(val.substring(1))
      }
      else { hasInclude = true }
    }
    else {
      // '@vueuse/core': [
      //    ['^useFetch', 'useMyFetch']  -> not allowed
      // ]
      if (val[0].startsWith(IMPORT_EXCLUDE_PREFIX))
        throw new Error(`[auto-import] preset ${presetName} contains exclude alias import ${val[0]}`)
      alias[val[0]] = val
    }
  }
  if (hasInclude && hasExclude)
    throw new Error(`[auto-import] preset ${presetName} contains include/exclude definition at same time`)

  Object.keys(alias).forEach((importAlias) => {
    if (exclude.includes(importAlias))
      throw new Error(`[auto-import] preset ${presetName} contains alias import ${importAlias} as an exclude import`)
  })
  return { presetExclude: exclude, presetAlias: alias }
}
