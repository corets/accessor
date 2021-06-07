export type ObjectAccessor<
  TSource,
  TAccessHandlerResult,
  TAccessHandlerArgs extends any[] = []
> = {
  [K in keyof TSource]: ObjectAccessor<
    TSource[K],
    TAccessHandlerResult,
    TAccessHandlerArgs
  >
} & {
  key: () => string
  keyAt: (key: string | number | symbol) => string
  get: (...args: TAccessHandlerArgs) => TAccessHandlerResult
  getAt: (
    key: string | number | symbol,
    ...args: TAccessHandlerArgs
  ) => TAccessHandlerResult
  has: () => boolean
  hasAt: (key: string | number | symbol) => boolean
}

type ObjectAccessHandler<TSource, TAccessHandlerResult, TArgs extends any[]> = (
  source: TSource,
  key?: string | number | symbol,
  ...args: TArgs
) => TAccessHandlerResult

export type CreateAccessor = <
  TSource,
  TAccessHandlerResult,
  TAccessHandlerArgs extends any[] = never
>(
  source: TSource,
  reader?: ObjectAccessHandler<
    TSource,
    TAccessHandlerResult,
    TAccessHandlerArgs
  >
) => ObjectAccessor<TSource, TAccessHandlerResult, TAccessHandlerArgs>

export type CreateNestedAccessor = <
  TSource,
  TAccessHandlerResult,
  TAccessHandlerArgs extends any[]
>(
  source: TSource,
  nestedKey: string | number | symbol | undefined,
  reader?: ObjectAccessHandler<
    TSource,
    TAccessHandlerResult,
    TAccessHandlerArgs
  >
) => ObjectAccessor<TSource, TAccessHandlerResult, TAccessHandlerArgs>
