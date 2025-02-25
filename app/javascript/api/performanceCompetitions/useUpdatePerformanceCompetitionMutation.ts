import { useMutation, useQueryClient } from 'react-query'
import type { AxiosError, AxiosResponse } from 'axios'

import client from 'api/client'
import {
  PerformanceCompetitionVariables,
  queryKey,
  deserialize,
  SerializedPerformanceCompetition,
  elementEndpoint
} from './common'

const updateEvent = (
  id: number,
  performanceCompetition: PerformanceCompetitionVariables
) =>
  client.put<
    { performanceCompetition: PerformanceCompetitionVariables },
    AxiosResponse<SerializedPerformanceCompetition>
  >(elementEndpoint(id), { performanceCompetition })

const useUpdatePerformanceCompetitionMutation = (eventId: number) => {
  const queryClient = useQueryClient()

  const mutateFn = (data: PerformanceCompetitionVariables) => updateEvent(eventId, data)

  return useMutation<
    AxiosResponse<SerializedPerformanceCompetition>,
    AxiosError<Record<string, string[]>>,
    PerformanceCompetitionVariables
  >(mutateFn, {
    onSuccess(response) {
      queryClient.setQueryData(queryKey(eventId), deserialize(response.data))
    }
  })
}

export default useUpdatePerformanceCompetitionMutation
