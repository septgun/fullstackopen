import { useState } from 'react'

const Statistics = (props) => {
  if (props.total === 0){
    return (
      <div> No feedback given</div>
    )
  }

  return (
    <div>
      <table>
        <tbody>
          <StatisticLine text={"good"} value={props.good} />
          <StatisticLine text={"neutral"} value={props.neutral} />
          <StatisticLine text={"bad"} value={props.bad} />
          <StatisticLine text={"all"} value={props.total} />
          <StatisticLine text={"average"} value={props.average} />
          <StatisticLine text={"positive"} value={props.percentage} />
        </tbody>
      </table>
    </div>
  )
}

const Button = ({onClick, text}) =>
  <button onClick={onClick}>{text}</button>


const StatisticLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value} {text === "positive" ? "%" : ""}</td>
    </tr>
  )
}


const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodFeedback = () => {
    const newValue = good + 1
    setGood(newValue)
  }

  const handleNeutralFeedback = () => {
    const newValue = neutral + 1
    setNeutral(newValue)
  }

  const handleBadFeedback = () => {
    const newValue = bad + 1
    setBad(newValue)
  }


  const total = good + neutral + bad
  const average = (good * 1 + neutral * 0 + bad * (-1)) / total
  const percentage = (good / (total)) * 100

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={handleGoodFeedback} text={"good"} />
      <Button onClick={handleNeutralFeedback} text={"neutral"} />
      <Button onClick={handleBadFeedback} text={"bad"} />

      <h1>statistics</h1>

      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        total={total}
        average={average}
        percentage={percentage}
      />
    </div>
  )
}

export default App