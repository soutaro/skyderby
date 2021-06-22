import { useQuery, useQueryClient } from 'react-query'
import axios from 'axios'

import { preloadCompetitors } from './competitors'
import { preloadCategories } from './categories'
import { preloadRounds } from './rounds'

const endpoint = eventId => `/api/v1/performance_competitions/${eventId}/standings`

const getRounds = eventId => axios.get(endpoint(eventId))

const queryKey = eventId => ['performanceCompetition', eventId, 'standings']

const buildQueryFn = queryClient => async ctx => {
  const [_key, eventId] = ctx.queryKey
  const { data } = await getRounds(eventId)

  await Promise.all([
    preloadCompetitors(eventId, queryClient),
    preloadCategories(eventId, queryClient),
    preloadRounds(eventId, queryClient)
  ])

  return data
}

export const useStandingsQuery = eventId => {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: queryKey(eventId),
    queryFn: buildQueryFn(queryClient)
  })
}
