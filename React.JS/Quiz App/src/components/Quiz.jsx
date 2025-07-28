import { useState, useCallback } from 'react'

import QUESTIONS from '../questions'
import Question from './Question'
import Summary from './Summary'

export default function Quiz () {
  const [userAnswers, setUserAnswers] = useState([])

  const activeQuestionIndex = userAnswers.length // NOTE: len starts at 1 and indexes at 0
  const quizIsComplete = activeQuestionIndex === QUESTIONS.length

  const handleSelectAnswer = useCallback(function handleSelectAnswer (
    selectedAnswer
  ) {
    setUserAnswers(prevUserAnswers => [...prevUserAnswers, selectedAnswer])
  },
  [])

  const handleSkipAnswer = useCallback(
    () => handleSelectAnswer(null),
    [handleSelectAnswer]
  )

  if (quizIsComplete) {
    return <Summary userAnswers={userAnswers} />
  }

  return (
    <div id='quiz'>
      <Question
        key={activeQuestionIndex}
        index={activeQuestionIndex}
        onSelectAnswer={handleSelectAnswer}
        onSkipAnswer={handleSkipAnswer}
      />
    </div>
  )
}
