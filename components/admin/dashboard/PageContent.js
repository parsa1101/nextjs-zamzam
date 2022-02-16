import React from 'react'
import { Container } from '@chakra-ui/react'

export default function PageContent({ centerContent = false, children }) {
  return (
    <Container
      maxW="container.md"
      centerContent={centerContent}
      paddingTop="1.5rem"
    >
      {children}
    </Container>
  )
}
