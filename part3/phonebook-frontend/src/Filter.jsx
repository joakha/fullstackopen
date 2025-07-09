const Filter = ({setSearchWord, searchWord}) => {
    return (
        <div>
            search with name: <input onChange={(e) => setSearchWord(e.target.value)} value={searchWord} />
        </div>
    )
}

export default Filter