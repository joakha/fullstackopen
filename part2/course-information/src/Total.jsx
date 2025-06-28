const Total = ({ parts }) => {

  const total = parts.reduce((prev, curr) => {
    return prev + curr.exercises
  }, 0)

  return (
    <strong>Number of exercises {total}</strong>
  )
}

export default Total