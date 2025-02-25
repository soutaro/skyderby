import React from 'react'
import { useLocation } from 'react-router-dom'

import { useI18n } from 'components/TranslationsProvider'
import {
  IndexParams,
  extractParamsFromUrl,
  mapParamsToUrl,
  useTracksQuery
} from 'api/tracks'
import Pagination from 'components/Pagination'
import TrackList from 'components/TrackList'
import ActivitySelect from './ActivitySelect'
import Filters from './Filters'
import styles from './styles.module.scss'

const TracksIndex = (): JSX.Element => {
  const { t } = useI18n()
  const location = useLocation()

  const params = extractParamsFromUrl(location.search)
  const { data, isLoading } = useTracksQuery(params)
  const tracks = data?.items ?? []
  const pagination = isLoading
    ? null
    : { page: data?.currentPage, totalPages: data?.totalPages }

  const buildUrl = (newParams: IndexParams) => mapParamsToUrl({ ...params, ...newParams })

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('application.header.tracks')}</h1>
        <ActivitySelect buildUrl={buildUrl} currentActivity={params.activity} />
      </div>

      <Filters params={params} buildUrl={buildUrl} />

      <TrackList tracks={tracks} />

      {pagination && <Pagination buildUrl={buildUrl} {...pagination} />}
    </div>
  )
}

export default TracksIndex
