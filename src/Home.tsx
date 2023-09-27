import { useSnippets } from '@/Api'
import { useEffect } from 'react'

function Home() {
  const data = useSnippets()
  useEffect(() => {
    console.log(data)
  }, [data])
  return (
    <>
      {data.categories.map(category => {
        return `${category.slice(0, 2).join("->")}`
      }).map(str => <><p>{str}</p><br/></>)}
    </>
  )
}

export default Home
