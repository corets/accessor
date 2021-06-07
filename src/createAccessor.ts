import { CreateAccessor, CreateNestedAccessor } from "./types"
import { get, has } from "lodash-es"

export const createAccessor: CreateAccessor = (source, reader) =>
  createNestedAccessor(source, undefined, reader)

const createNestedAccessor: CreateNestedAccessor = (
  source,
  nestedKey,
  reader
) => {
  return new Proxy(source as any, {
    get(_, key) {
      const createAbsoluteKey = (key) =>
        nestedKey ? [nestedKey, key].join(".") : key

      if (key === "key") {
        return () => nestedKey
      }

      if (key === "keyAt") {
        return (key) =>
          createNestedAccessor(source, createAbsoluteKey(key), reader).key()
      }

      if (key === "get") {
        return (...args) => {
          if (reader) {
            return reader(source, nestedKey, ...(args as any))
          }

          return nestedKey === undefined ? source : get(source, nestedKey)
        }
      }

      if (key === "getAt") {
        return (key, ...args) =>
          createNestedAccessor(source, createAbsoluteKey(key), reader).get(
            ...(args as any)
          )
      }

      if (key === "has") {
        return () => has(source, nestedKey!)
      }

      if (key === "hasAt") {
        return (key) =>
          createNestedAccessor(source, createAbsoluteKey(key), reader).has()
      }

      return createNestedAccessor(source, createAbsoluteKey(key), reader)
    },
  })
}
