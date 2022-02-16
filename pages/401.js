import NextLink from 'next/link'
import {
  Box,
  Heading,
  Text,
  Container,
  Divider,
  Button
} from '@chakra-ui/react'

const NoPermission = () => {
  return (
    <Container>
      <Heading as="h1">کاربر گرامی!</Heading>
      <Text>شما&apos;اجازه دسترسی به این صفحه را ندارید</Text>
      <Divider my={6} />

      <Box my={6} align="center">
        <NextLink href="/">
          <Button colorScheme="teal">برگشت به صفحه اصلی</Button>
        </NextLink>
      </Box>
    </Container>
  )
}

export default NoPermission
