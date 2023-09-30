import { useSnippets } from '@/Api'
import SnippetCard from '@/SnippetCard'
import { Box, Divider, Flex, Heading, Link, List, ListItem, UnorderedList, VStack } from '@chakra-ui/layout'
import { useColorMode } from '@chakra-ui/react'
import { useEffect, useMemo } from 'react'

function Home() {
  const { colorMode, toggleColorMode } = useColorMode()
  useEffect(() => {
    if (colorMode === 'light') {
      toggleColorMode()
    }
  }, [colorMode, toggleColorMode])
  const data = useSnippets()
  useEffect(() => {
    console.log(data)
  }, [data])

  const categories = useMemo<[main: string, sub: string[]][]>(() => {
    const res: Record<string, string[]> = {};
    data.categories.forEach(([main, sub]) => {
      if (!res[main]) res[main] = [];
      res[main].push(sub)
    })
    return Object.entries(res)
  }, [data])

  return (
    <VStack width='fit-content' ml='auto' mr='auto' spacing={8}>
      {categories.map(([main, subs]) => {
        return (
          <Flex gap={4} direction='column' key={main} w={['95%', null, '60ch']}>
            <Heading>{main}</Heading>
            <List display='flex' flexFlow={"row wrap"} rowGap={3} width={"100%"}>
              {subs.map(sub => (
                <ListItem key={main + sub} flexBasis={["51%", null, "34%"]} flexGrow={1}><Link>{sub}</Link></ListItem>
              ))}
            </List>
          </Flex>
        );
      }).reduce((acc, x) => <>{acc}<Divider w={["100%", null, '54ch']} overflow={'hidden'}/>{x}</>, <></>)}
      
      {
        data.snippets.map((snippet, i) => <SnippetCard key={i} snippet={snippet}></SnippetCard>)
      }
    </VStack>
  )
}

export default Home
