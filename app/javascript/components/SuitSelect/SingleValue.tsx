import React from 'react'
import { components, SingleValueProps } from 'react-select'

import SuitLabel from 'components/SuitLabel'
import { OptionData } from './types'

const SingleValue = (props: SingleValueProps<OptionData>): JSX.Element => {
  const {
    data: {
      name,
      make: { code }
    }
  } = props

  return (
    <components.SingleValue {...props}>
      <SuitLabel name={name} code={code} />
    </components.SingleValue>
  )
}

export default SingleValue
