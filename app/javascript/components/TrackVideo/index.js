import React, { useRef } from 'react'
import { Formik, Field } from 'formik'

import Input from 'components/ui/Input'
import DefaultButton from 'components/ui/buttons/Default'
import PrimaryButton from 'components/ui/buttons/Primary'
import { videoCodeFromUrl } from 'utils/youtube'
import Player from './Player'
import { Container, Section, Description, Controls, Footer } from './elements'

import AltitudeChart from 'components/AltitudeChart'
import { useTrackPoints } from 'components/AltitudeRangeSelect'
import { usePageContext } from 'components/PageContext'

import PlotLine from 'components/Highchart/Plotline'

const TrackVideo = () => {
  const playerRef = useRef()

  const handleSubmit = values => console.log(values)
  const { trackId } = usePageContext()
  const points = useTrackPoints(trackId, { trimed: false })

  return (
    <Container>
      <Formik
        initialValues={{ url: '', videoId: '', startTime: 0, trackOffset: 10 }}
        onSubmit={handleSubmit}
      >
        {({ values, handleSubmit, setFieldValue }) => {
          const handleUrlChange = e => {
            const { value } = e.target

            setFieldValue('url', value)
            setFieldValue('videoId', videoCodeFromUrl(value))
          }

          const setTimeFromVideo = () => {
            setFieldValue('startTime', playerRef.current.getPlayerTime())
          }

          const handleOnClick = event => {
            const offset = Math.round(event.xAxis[0].value * 10) / 10
            setFieldValue('trackOffset', offset)
          }

          return (
            <form onSubmit={handleSubmit}>
              <Section>
                <Description>
                  <h2>Youtube video</h2>
                </Description>
                <Controls>
                  <Field
                    as={Input}
                    name="url"
                    placeholder="Enter Youtube link here"
                    onChange={handleUrlChange}
                  />
                </Controls>
              </Section>

              <Section>
                <Description>
                  <h2>Start of the jump on video</h2>
                  <p>
                    Play video until jump started, pause the video at the beginning of the
                    jump, then press button &quot;Set&quot; in the field to paste current
                    time. Value in the field is a seconds from beginning of video.
                  </p>
                </Description>
                <Controls>
                  <Player ref={playerRef} videoId={values.videoId} />
                  <Field as={Input} name="startTime" />
                  <DefaultButton type="button" onClick={setTimeFromVideo}>
                    Set!
                  </DefaultButton>
                </Controls>
              </Section>

              <Section>
                <Description>
                  <h2>Start of the jump on track</h2>
                  <p>
                    Find start of the jump on the chart and click on it. For precious
                    changing use chart zooming feature or buttons in the field. Value in
                    the field is a seconds from when you start recording jump.
                  </p>
                </Description>
                <Controls>
                  <AltitudeChart points={points} onClick={handleOnClick}>
                    {chart => (
                      <PlotLine
                        chart={chart}
                        color="#FF0000"
                        id="track-offset"
                        width={2}
                        value={Number(values.trackOffset)}
                        zIndex={8}
                      />
                    )}
                  </AltitudeChart>
                  <Field as={Input} name="trackOffset" />
                </Controls>
              </Section>
              <Footer>
                <DefaultButton type="button">Delete</DefaultButton>
                <PrimaryButton type="submit">Save</PrimaryButton>
              </Footer>
            </form>
          )
        }}
      </Formik>
    </Container>
  )
}

export default TrackVideo
