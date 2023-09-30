/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import Home from '@/Home.tsx'

import { Prism } from "prism-react-renderer";

(typeof global !== "undefined" ? global : window).Prism = Prism;


// @ts-ignore
await import("prismjs/components/prism-java")
// @ts-ignore
await import("prismjs/components/prism-kotlin")
// @ts-ignore
await import("prismjs/components/prism-scala")
// @ts-ignore
await import("prismjs/components/prism-haskell")
// @ts-ignore
await import("prismjs/components/prism-clojure")
// @ts-ignore
await import("prismjs/components/prism-rust")
// @ts-ignore
await import("prismjs/components/prism-go")


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider>
      <Home />
    </ChakraProvider>
  </React.StrictMode>,
)
