import React, { useState, useRef } from 'react'
import ResultModal from './ResultModal'

const TimerChallenge = ({ title, targetTime }) => {
  const [timerStarted, setTimerStarted] = useState(false)
  const [timerExpired, setTimerExpired] = useState(false)

  const timer = useRef()
  const dialog = useRef()

  const [timeRem, setTimeRem] = useState(targetTime * 1000)

  const timerIsActive = timeRem > 0 && timeRem < targetTime * 1000

  if (timeRem <= 0) {
    clearInterval(timer.current)
    dialog.current.open()
  }

  function handleReset() {
    setTimeRem(targetTime * 1000)
  }

  function handleStart () {
    timer.current = setInterval(() => {
      // setTimerExpired(true)
      // dialog.current.open()
      setTimeRem(prevTimeRea => prevTimeRea - 10)
    }, 10)

    setTimerStarted(true)
  }

  function handleStop () {
    // How to access timer from 'handleStart' func ? Use ref
    dialog.current.open()
    clearInterval(timer.current)
  }

  return (
    <>
      <ResultModal ref={dialog} targetTime={targetTime} remTime={timeRem} onReset={handleReset} />
      <section className='challenge'>
        <h2>{title}</h2>
        {timerExpired && <p>You Lost!</p>}
        <p className='challenge-time'>
          {targetTime} second{targetTime > 1 ? 's' : ''}
        </p>
        <p>
          <button onClick={timerIsActive ? handleStop : handleStart}>
            {timerIsActive ? 'Stop' : 'Start'} Challenge
          </button>
        </p>
        <p className={timerIsActive ? 'active' : undefined}>
          {timerIsActive ? 'Time is running...' : 'Timer inactive'}
        </p>
      </section>
    </>
  )
}

export default TimerChallenge
