import { useState } from 'react'

const Statistics = ({ good, neutral, bad, all, average, positive }) => {

  if (all === 0) {
    return (
      <p>No feedback given</p>
    )
  }

  return (
    <>
    <h2>Statistics</h2>
      <table>
        <tbody>
          <StatisticsLine text={"good"} value={good} />
          <StatisticsLine text={"neutral"} value={neutral} />
          <StatisticsLine text={"bad"} value={bad} />
          <StatisticsLine text={"all"} value={all} />
          <StatisticsLine text={"average"} value={average} />
          <StatisticsLine text={"positive"} value={positive} />
        </tbody>
      </table>
    </>
  )
}

const StatisticsLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{text === "average" || text === "positive" ? value.toFixed(1) : value}{text === "positive" && " %"}</td>
    </tr>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.eventHandler}>{props.displayName}</button>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const all = good + neutral + bad;
  const average = (good - bad) / all || 0;
  const positive = (good / all) * 100 || 0;

  return (
    <div>
      <h1>give feedback</h1>
      <div>
        <Button
          displayName={"good"}
          eventHandler={() => setGood(prevGood => prevGood + 1)}
        />
        <Button
          displayName={"neutral"}
          eventHandler={() => setNeutral(prevNeutral => prevNeutral + 1)}
        />
        <Button
          displayName={"bad"}
          eventHandler={() => setBad(prevBad => prevBad + 1)}
        />
      </div>
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        all={all}
        average={average}
        positive={positive}
      />
    </div>
  )
}

export default App