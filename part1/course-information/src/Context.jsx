import Part1 from "./Part1"
import Part2 from "./Part2"
import Part3 from "./Part3"

const Context = (props) => {

    return (
        <>
        <Part1 part1={props.parts[0].name} exercises1={props.parts[0].exercises}/>
        <Part2 part2={props.parts[1].name} exercises2={props.parts[1].exercises}/>
        <Part3 part3={props.parts[2].name} exercises3={props.parts[2].exercises}/>
        </>
    )
}

export default Context