import {
  QueryClient,
  QueryFunction,
  useQuery,
  UseQueryOptions,
  UseQueryResult
} from 'react-query'
import client, { AxiosResponse } from 'api/client'
import { loadIds } from 'api/helpers'

export type ManufacturerRecord = {
  id: number
  name: string
  code: string
  active: boolean
}

type ManufacturersIndex = {
  items: ManufacturerRecord[]
  currentPage: number
  totalPages: number
}

export type CollectionQueryKey = readonly ['manufacturers']
export type RecordQueryKey = readonly ['manufacturers', number | undefined]

const endpoint = '/api/v1/manufacturers'

const getManufacturer = (id: number) =>
  client
    .get<never, AxiosResponse<ManufacturerRecord>>(`${endpoint}/${id}`)
    .then(response => response.data)

const getAllManufacturers = () =>
  client
    .get<never, AxiosResponse<ManufacturersIndex>>(endpoint)
    .then(response => response.data)

const getManufacturersById = (ids: number[]) => loadIds<ManufacturerRecord>(endpoint, ids)

const recordQueryFn: QueryFunction<ManufacturerRecord, RecordQueryKey> = async ctx => {
  const [_key, id] = ctx.queryKey

  if (typeof id !== 'number') {
    throw new Error(`Expected manufacturer id to be a number, received ${typeof id}`)
  }

  return getManufacturer(id)
}

const recordQueryKey = (id: number | undefined): RecordQueryKey => ['manufacturers', id]

const collectionQueryFn: QueryFunction<
  ManufacturerRecord[],
  CollectionQueryKey
> = async () => {
  const { items } = await getAllManufacturers()

  return items
}

export const cacheManufacturers = (
  manufacturers: ManufacturerRecord[],
  queryClient: QueryClient
): void =>
  manufacturers.forEach(manufacturer =>
    queryClient.setQueryData(recordQueryKey(manufacturer.id), manufacturer)
  )

export const preloadManufacturers = async (
  ids: number[],
  queryClient: QueryClient
): Promise<ManufacturerRecord[]> => {
  const missingIds = ids
    .filter(Boolean)
    .filter(id => !queryClient.getQueryData(recordQueryKey(id)))

  if (missingIds.length === 0) return []

  const { items: manufacturers } = await getManufacturersById(missingIds)
  cacheManufacturers(manufacturers, queryClient)

  return manufacturers
}

export const getCachedManufacturers = (
  ids: number[],
  queryClient: QueryClient
): ManufacturerRecord[] =>
  ids
    .map(id =>
      id ? queryClient.getQueryData<ManufacturerRecord>(recordQueryKey(id)) : undefined
    )
    .filter((record): record is ManufacturerRecord => record !== undefined)

type QueryOptions = UseQueryOptions<
  ManufacturerRecord,
  Error,
  ManufacturerRecord,
  RecordQueryKey
>

const cacheOptions = {
  cacheTime: 60 * 60 * 1000,
  staleTime: 30 * 60 * 1000
}

const manufacturerQuery = (id: number | undefined): QueryOptions => ({
  queryKey: recordQueryKey(id),
  queryFn: recordQueryFn,
  enabled: Boolean(id),
  ...cacheOptions
})

export const useManufacturerQuery = (
  id: number | undefined,
  options: QueryOptions = {}
): UseQueryResult<ManufacturerRecord> =>
  useQuery({ ...manufacturerQuery(id), ...options })

const manufacturersQuery = () => ({
  queryKey: ['manufacturers'] as const,
  queryFn: collectionQueryFn,
  ...cacheOptions
})

export const useManufacturersQuery = (
  options: UseQueryOptions<
    ManufacturerRecord[],
    Error,
    ManufacturerRecord[],
    CollectionQueryKey
  > = {}
) => useQuery({ ...manufacturersQuery(), ...options })
