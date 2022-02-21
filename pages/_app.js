import dynamic from 'next/dynamic'
import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'

import Fonts from '../components/Font'
import theme from '../lib/theme'
import { RtlProvider } from '../components/rtl'
const Layout = dynamic(() => import('../components/layouts/main'))
import { LayoutContextProvider } from '../utils/Store'
const { AnimatePresence } = require('framer-motion')

import { useEffect, useState } from 'react'

function MyApp({ Component, pageProps, router }) {
  //for Expected server HTML to contain a matching <button> in <div> error
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => {
    setHasMounted(true)
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])
  if (!hasMounted) {
    return null
  }
  ///

  return (
    <ChakraProvider theme={theme}>
      <Fonts />

      <RtlProvider>
        <Layout router={router}>
          <LayoutContextProvider>
            <AnimatePresence exitBeforeEnter initial={true}>
              <Component {...pageProps} />
            </AnimatePresence>
          </LayoutContextProvider>
        </Layout>
      </RtlProvider>
    </ChakraProvider>
  )
}

export default MyApp
