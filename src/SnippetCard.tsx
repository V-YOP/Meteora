/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Snippet } from "@/Api";
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Code,
  Divider,
  HStack,
  Heading,
  Stack,
  StackDivider,
  StackItem,
  Tag,
  TagLabel,
  VStack,
  chakra,
} from "@chakra-ui/react";
import { Highlight, themes, type PrismTheme } from "prism-react-renderer";
import Markdown from "react-markdown";

const MY_DARK_THEME: PrismTheme = {
  ...themes.oneDark,
  plain: { ...themes.oneDark, backgroundColor: "#292f3a" },
}

function getCodeBlock(lang: string, code: string) {
  return (
      <Highlight prism={window.Prism} language={lang} theme={MY_DARK_THEME} code={code.trim()}>
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <chakra.pre style={style} pt={1} pb={1} pl={2} pr={2} overflow='hidden' minH='2ch'>
            {tokens.map((line, i) => (
              <Box key={i} {...getLineProps({ line })} overflow={'scroll'}>
                {line.map((token, key) => (
                  <chakra.span key={key} {...getTokenProps({ token })} />
                ))}
              </Box>
            ))}
          </chakra.pre>
        )}
      </Highlight>
  );
}

function parseSegment(str: string) {
  return (
    <Markdown
      components={{
        pre: ({ node }) => {
          if (!node) throw new Error("wtf?");
          // @ts-ignore
          const code: string = node.children[0].children[0].value;
          const lang: string =
            // @ts-ignore
            node.children[0].properties.className[0].split("-")[1];
          console.log(code, lang);
          return getCodeBlock(lang, code);
        },
        code: ({node}) => {
          // @ts-ignore
          const code: string = node.children[0].value;
          return <Code paddingInline={1} marginInline={1}>{code}</Code>
        }
      }}
    >
      {str}
    </Markdown>
  );
}

type SnippetCardParam = {
  snippet: Snippet;
};
function SnippetCard({ snippet }: SnippetCardParam) {
  console.log(snippet);
  return (
    <Card maxW={"80ch"} size="sm">
      <CardHeader width={"100%"} pt={6} pl={6} pr={6}>
        <HStack spacing={4} justifyContent="space-between">
          {snippet.title && <Heading size="md">{snippet.title}</Heading>}
          <HStack wrap="wrap">
            {snippet.tag.map((tagName) => (
              <Tag key={tagName} variant="solid" colorScheme="blue">
                <TagLabel>{tagName}</TagLabel>
              </Tag>
            ))}
          </HStack>
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack spacing={4} rounded={"lg"} overflow={"hidden"} width="100%">
          {snippet.segments.map((segment, i) => {
            const roundProp =
              i === 0
                ? { roundedTop: "lg" }
                : i === snippet.segments.length - 1
                ? { roundedBottom: "lg" }
                : { round: "lg" };

            return (
              <VStack alignItems='left' key={i} {...roundProp} overflow={"hidden"} width="100%">
                {parseSegment(segment)}
              </VStack>
            );
          })}
        </VStack>
      </CardBody>
    </Card>
  );
}

export default SnippetCard;
