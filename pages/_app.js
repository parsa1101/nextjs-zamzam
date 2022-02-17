import dynamic from 'next/dynamic'
import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'

import Fonts from '../components/Font'
import theme from '../lib/theme'
import { RtlProvider } from '../components/rtl'
// import Layout from '../components/layouts/main'
const Layout = dynamic(() => import('../components/layouts/main'))
import { LayoutContextProvider } from '../utils/Store'
// import { AnimatePresence } from 'framer-motion'
const { AnimatePresence } = require('framer-motion')

import { useEffect, useState } from 'react'

function MyApp({ Component, pageProps, router }) {
  // const [menuItems, setMenuItems] = useState({ data: [] })

  /* eslint-disable react-hooks/exhaustive-deps */

  // useEffect(() => {
  //   async function getMenuItem() {
  //     try {
  //       const { data } = await axios.get(`/api/category`)
  //       setMenuItems(prev => ({ ...prev, data: data }))
  //     } catch (err) {
  //       alert(err)
  //     }
  //   }
  //   getMenuItem()
  // }, [])

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
