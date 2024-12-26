import React from 'react'
import { CFooter } from '@coreui/react'
import AudioPlayer , { RHAP_UI } from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'
import { BsPlay } from 'react-icons/bs'

const AppFooter = () => {
  return (
    <CFooter position="sticky" style={{ width: '100%', padding: '15px 0px 0px 0px'}}>
      {/* <ReactPlayer url={'./song1.mp3'} controls={true} width={"100%"} height={"15px"} config={{ file: {forceAudio: true} }} /> */}
      <AudioPlayer
        src="/song1.mp3"
        style={{ width: '100%', backgroundColor: '#191414' }}
        layout="stacked-reverse"
        customIcons={{ play: <BsPlay /> }}
        customAdditionalControls={
          [
            RHAP_UI.LOOP,
            <button>button 2 </button>,
            <button>button 3 </button>,
            <button>button 4 </button>,
          ]
        }
        customControlsSection={[
          RHAP_UI.LOOP,
          RHAP_UI.MAIN_CONTROLS,
          <button>assddd</button>
        ]}
        customProgressBarSection={[

          RHAP_UI.CURRENT_TIME,
          RHAP_UI.PROGRESS_BAR,
          RHAP_UI.DURATION,
          <div>&nbsp; &nbsp;</div>,
          RHAP_UI.VOLUME,
        ]}
        customVolumeControls={[]}
      />
    </CFooter>
  )
}

export default React.memo(AppFooter)
