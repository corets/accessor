import { createAccessor } from "./createAccessor"
import { get } from "lodash"

const data = {
  property: "property value",
  list: ["list value1", "list value2"],
  nested: {
    property: "nested.property value",
    list: ["nested.list value1", "nested.list value2"],
  },
}

const handler = (source, key, surround: string = "") => {
  if (key === undefined) {
    return undefined
  }

  const value = get(source, key)

  if (value === undefined) {
    return undefined
  }

  if (typeof value === "string") {
    return `${surround}${value}${surround}`
  }

  return value
}

describe("createAccessor", () => {
  it("key() trough .property", () => {
    const accessor = createAccessor(data)

    expect(accessor.property.key()).toEqual("property")
    expect(accessor.list.key()).toEqual("list")
    expect(accessor.nested.key()).toEqual("nested")
    expect(accessor.nested.property.key()).toEqual("nested.property")
  })

  it("key() trough [index]", () => {
    const accessor = createAccessor(data)

    expect(accessor["property"].key()).toEqual("property")
    expect(accessor["some_property"].key()).toEqual("some_property")
    expect(accessor["list"].key()).toEqual("list")

    expect(accessor.list[0].key()).toEqual("list.0")
    expect(accessor.list[1].key()).toEqual("list.1")
    expect(accessor.list[2].key()).toEqual("list.2")

    expect(accessor["nested"].key()).toEqual("nested")
    expect(accessor["nested.property"].key()).toEqual("nested.property")
    expect(accessor["nested.some_property"].key()).toEqual(
      "nested.some_property"
    )
  })

  it("keyAt() trough .property", () => {
    const accessor = createAccessor(data)

    expect(accessor.keyAt("property")).toEqual("property")
    expect(accessor.keyAt("list")).toEqual("list")
    expect(accessor.keyAt("nested")).toEqual("nested")
    expect(accessor.keyAt("nested.property")).toEqual("nested.property")
    expect(accessor.nested.keyAt("property")).toEqual("nested.property")
  })

  it("keyAt() trough [index]", () => {
    const accessor = createAccessor(data)

    expect(accessor["list"].keyAt(0)).toEqual("list.0")
    expect(accessor["list"].keyAt(1)).toEqual("list.1")
    expect(accessor["list"].keyAt(2)).toEqual("list.2")

    expect(accessor["nested"].keyAt("property")).toEqual("nested.property")
    expect(accessor["nested"].keyAt("some_property")).toEqual(
      "nested.some_property"
    )
  })

  it("get() trough .property", () => {
    const accessor = createAccessor(data)

    expect(accessor.property.get()).toEqual("property value")
    expect(accessor.list.get()).toEqual(data.list)
    expect(accessor.nested.get()).toEqual(data.nested)
    expect(accessor.nested.property.get()).toEqual("nested.property value")
  })

  it("get() trough [index]", () => {
    const accessor = createAccessor(data)

    expect(accessor["property"].get()).toEqual("property value")
    expect(accessor["some_property"].get()).toEqual(undefined)
    expect(accessor["list"].get()).toEqual(data.list)

    expect(accessor.list[0].get()).toEqual("list value1")
    expect(accessor.list[1].get()).toEqual("list value2")
    expect(accessor.list[2].get()).toEqual(undefined)

    expect(accessor["nested"].get()).toEqual(data.nested)
    expect(accessor["nested.property"].get()).toEqual("nested.property value")
    expect(accessor["nested.some_property"].get()).toEqual(undefined)
  })

  it("get() with custom handler trough .property", () => {
    const accessor = createAccessor(data, handler)

    expect(accessor.property.get()).toEqual("property value")
    expect(accessor.property.get("_")).toEqual("_property value_")
    expect(accessor.list.get()).toEqual(data.list)
    expect(accessor.list.get("_")).toEqual(data.list)
    expect(accessor.nested.get()).toEqual(data.nested)
    expect(accessor.nested.get("_")).toEqual(data.nested)
    expect(accessor.nested.property.get()).toEqual("nested.property value")
    expect(accessor.nested.property.get("_")).toEqual("_nested.property value_")
  })

  it("get() with custom handler trough [index]", () => {
    const accessor = createAccessor(data, handler)

    expect(accessor["property"].get()).toEqual("property value")
    expect(accessor["property"].get("_")).toEqual("_property value_")
    expect(accessor["some_property"].get()).toEqual(undefined)
    expect(accessor["some_property"].get("_")).toEqual(undefined)
    expect(accessor["list"].get()).toEqual(data.list)
    expect(accessor["list"].get("_")).toEqual(data.list)

    expect(accessor.list[0].get()).toEqual("list value1")
    expect(accessor.list[0].get("_")).toEqual("_list value1_")
    expect(accessor.list[1].get()).toEqual("list value2")
    expect(accessor.list[1].get("_")).toEqual("_list value2_")
    expect(accessor.list[2].get()).toEqual(undefined)
    expect(accessor.list[2].get("_")).toEqual(undefined)

    expect(accessor["nested"].get()).toEqual(data.nested)
    expect(accessor["nested"].get("_")).toEqual(data.nested)
    expect(accessor["nested.property"].get()).toEqual("nested.property value")
    expect(accessor["nested.property"].get("_")).toEqual(
      "_nested.property value_"
    )
    expect(accessor["nested.some_property"].get()).toEqual(undefined)
    expect(accessor["nested.some_property"].get("_")).toEqual(undefined)
  })

  it("getAt() trough .property", () => {
    const accessor = createAccessor(data)

    expect(accessor.getAt("property")).toEqual("property value")
    expect(accessor.getAt("some_property")).toEqual(undefined)
    expect(accessor.getAt("list")).toEqual(data.list)

    expect(accessor.list.getAt(0)).toEqual("list value1")
    expect(accessor.list.getAt(1)).toEqual("list value2")
    expect(accessor.list.getAt(2)).toEqual(undefined)

    expect(accessor.getAt("nested")).toEqual(data.nested)
    expect(accessor.getAt("nested.property")).toEqual("nested.property value")
    expect(accessor.nested.getAt("property")).toEqual("nested.property value")
    expect(accessor.getAt("nested.some_property")).toEqual(undefined)
    expect(accessor.nested.getAt("some_property")).toEqual(undefined)
  })

  it("getAt() trough [index]", () => {
    const accessor = createAccessor(data)

    expect(accessor["list"].getAt(0)).toEqual("list value1")
    expect(accessor["list"].getAt(1)).toEqual("list value2")
    expect(accessor["list"].getAt(2)).toEqual(undefined)

    expect(accessor["nested"].getAt("property")).toEqual(
      "nested.property value"
    )
    expect(accessor["nested"].getAt("some_property")).toEqual(undefined)
  })

  it("getAt() with custom handler trough .property", () => {
    const accessor = createAccessor(data, handler)

    expect(accessor.getAt("property", "_")).toEqual("_property value_")
    expect(accessor.getAt("some_property", "_")).toEqual(undefined)
    expect(accessor.getAt("list", "_")).toEqual(data.list)

    expect(accessor.list.getAt(0, "_")).toEqual("_list value1_")
    expect(accessor.list.getAt(1, "_")).toEqual("_list value2_")
    expect(accessor.list.getAt(2, "_")).toEqual(undefined)

    expect(accessor.getAt("nested", "_")).toEqual(data.nested)
    expect(accessor.getAt("nested.property", "_")).toEqual(
      "_nested.property value_"
    )
    expect(accessor.nested.getAt("property", "_")).toEqual(
      "_nested.property value_"
    )
    expect(accessor.getAt("nested.some_property", "_")).toEqual(undefined)
    expect(accessor.nested.getAt("some_property", "_")).toEqual(undefined)
  })

  it("getAt() with custom handler trough [index]", () => {
    const accessor = createAccessor(data, handler)

    expect(accessor["list"].getAt(0, "_")).toEqual("_list value1_")
    expect(accessor["list"].getAt(1, "_")).toEqual("_list value2_")
    expect(accessor["list"].getAt(2, "_")).toEqual(undefined)

    expect(accessor["nested"].getAt("property", "_")).toEqual(
      "_nested.property value_"
    )
    expect(accessor["nested"].getAt("some_property", "_")).toEqual(undefined)
  })

  it("has() trough .property", () => {
    const accessor = createAccessor(data)

    expect(accessor.property.has()).toEqual(true)
    expect(accessor.nested.property.has()).toEqual(true)
  })

  it("has() trough [index]", () => {
    const accessor = createAccessor(data)

    expect(accessor["list.0"].has()).toEqual(true)
    expect(accessor["list.1"].has()).toEqual(true)
    expect(accessor["list.2"].has()).toEqual(false)

    expect(accessor["nested.property"].has()).toEqual(true)
    expect(accessor["nested.some_property"].has()).toEqual(false)
  })

  it("hasAt() trough .property", () => {
    const accessor = createAccessor(data)

    expect(accessor.hasAt("property")).toEqual(true)
    expect(accessor.hasAt("some_property")).toEqual(false)
    expect(accessor.hasAt("list")).toEqual(true)

    expect(accessor.hasAt("list.0")).toEqual(true)
    expect(accessor.list.hasAt("0")).toEqual(true)
    expect(accessor.hasAt("list.1")).toEqual(true)
    expect(accessor.list.hasAt("1")).toEqual(true)
    expect(accessor.hasAt("list.2")).toEqual(false)
    expect(accessor.list.hasAt("2")).toEqual(false)

    expect(accessor.hasAt("nested")).toEqual(true)
    expect(accessor.hasAt("nested.property")).toEqual(true)
    expect(accessor.nested.hasAt("property")).toEqual(true)
    expect(accessor.hasAt("nested.some_property")).toEqual(false)
    expect(accessor.nested.hasAt("some_property")).toEqual(false)
  })

  it("hasAt() trough [index]", () => {
    const accessor = createAccessor(data)

    expect(accessor["list"].hasAt("0")).toEqual(true)
    expect(accessor["list"].hasAt("1")).toEqual(true)
    expect(accessor["list"].hasAt("2")).toEqual(false)

    expect(accessor["nested"].hasAt("property")).toEqual(true)
    expect(accessor["nested"].hasAt("some_property")).toEqual(false)
  })
})
