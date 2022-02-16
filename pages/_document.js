import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import { ColorModeScript } from '@chakra-ui/react'
import theme from '../lib/theme'

class Document extends NextDocument {
  static async getInitialProps(ctx) {
    return await NextDocument.getInitialProps(ctx)
  }

  render() {
    // const { locale } = this.props.__NEXT_DATA__;
    // const dir = locale === 'ar' ? 'rtl' : 'ltr';
    return (
      <Html dir="rtl" lang="fa">
        <Head />
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />

          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default Document
