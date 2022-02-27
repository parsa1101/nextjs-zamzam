import dynamic from 'next/dynamic'

import Head from 'next/head'
import NavBar from '../navbar'
import { Box, Container } from '@chakra-ui/react'

const VoxelPicLoader = dynamic(() => import('../voxel-pic-loader'))
const Footer = dynamic(() => import('../footer'))
const LazyVoxelPic = dynamic(() => import('../voxel-pic'), {
  ssr: false,
  loading: () => <VoxelPicLoader />
})
const Main = ({ children, router }) => {
  return (
    <Box as="main" pb={8}>
      <Head>
        <title>ZAM_ZAM_AHKAM - Homepage</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Zam_Zam_Ahkam's homepage" />
        <meta name="author" content="ZAM_ZAM_AHKAM Matsuyama" />
        <meta name="author" content="craftzdog" />
        <link rel="apple-touch-icon" href="apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        {/* <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@craftzdog" />
        <meta name="twitter:creator" content="@craftzdog" /> */}
        <meta name="twitter:image" content="/card.png" />
        <meta property="og:site_name" content="ZAM_ZAM_AHKAM's Homepage" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/card.png" />
      </Head>

      <NavBar path={router.asPath} />

      <Container maxW="container.xl" pt={20}>
        <LazyVoxelPic />
        {children}

        <Footer />
      </Container>
    </Box>
  )
}

export default Main
