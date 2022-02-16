import React from 'react'
import { Container, Stack, Link, Text, Icon } from '@chakra-ui/react'
import { FaGithub, FaTwitter } from 'react-icons/fa'

export default function Footer() {
  return (
    <Container
      maxW="container.lg"
      marginTop="auto"
      paddingTop="1.5rem"
      paddingBottom="1.5rem"
    >
      <Stack
        flexDirection={['column', 'row']}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack isInline fontWeight="500" fontSize="sm">
          <Text color="secondary.link">&copy; 2021</Text>
          <Link href="#" color="secondary.link" fontWeight="bold">
            ZAM_ZAM_AHKAM
          </Link>
          <Text color="secondary.link">&mdash; All rights reserved</Text>
        </Stack>
        <Stack isInline fontWeight="500" fontSize="sm">
          <Link className="footer-nav-item" href="#" color="secondary.link">
            Privacy Policy
          </Link>
          <Link
            className="footer-nav-item"
            color="secondary.link"
            href="https://boshrapardaz.ir/"
            isExternal
          >
            <Icon as={FaGithub} marginRight="0.2rem" verticalAlign="middle" />
            BOSHRA_PARDAZ
          </Link>
          <Link
            className="footer-nav-item"
            color="secondary.link"
            href="https://twitter.com/maxkostinevich"
            isExternal
          >
            <Icon as={FaTwitter} marginRight="0.2rem" verticalAlign="middle" />
            @izadi.zahra
          </Link>
        </Stack>
      </Stack>
    </Container>
  )
}
