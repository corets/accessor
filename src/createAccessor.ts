import { CreateAccessor, CreateNestedAccessor } from "./types"
import { get, has } from "lodash"

export const createAccessor: CreateAccessor = (source, handler) =>
  createNestedAccessor(source, undefined, handler)

const createNestedAccessor: CreateNestedAccessor = (
  source,
  nestedKey,
  handler
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
          createNestedAccessor(source, createAbsoluteKey(key), handler).key()
      }

      if (key === "get") {
        return (...args) => {
          if (handler) {
            return handler(source, nestedKey, ...(args as any))
          }

          return nestedKey === undefined ? source : get(source, nestedKey)
        }
      }

      if (key === "getAt") {
        return (key, ...args) =>
          createNestedAccessor(source, createAbsoluteKey(key), handler).get(
            ...(args as any)
          )
      }

      if (key === "has") {
        return () => has(source, nestedKey!)
      }

      if (key === "hasAt") {
        return (key) =>
          createNestedAccessor(source, createAbsoluteKey(key), handler).has()
      }

      return createNestedAccessor(source, createAbsoluteKey(key), handler)
    },
  })
}
