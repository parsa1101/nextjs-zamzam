import {
  ButtonGroup,
  Container,
  Divider,
  IconButton,
  Stack,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import * as React from 'react'
import { FaLinkedin, FaTwitter } from 'react-icons/fa'

const Footer = () => {
  return (
    // <Box align="center" opacity={0.4} fontSize="sm">
    //   &copy; {new Date().getFullYear()} Takuya Matsuyama. All Rights Reserved.
    // </Box>
    <Container
      as="footer"
      role="contentinfo"
      bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
    >
      <Divider />
      <Stack
        pt="8"
        pb="12"
        justify="space-between"
        direction={{ base: 'column-reverse', md: 'row' }}
        align="center"
      >
        {/* <Logo /> */}
        <Text fontSize="sm" color="subtle">
          &copy; {new Date().getFullYear()} BOSHRA-PARDAZ.ir, All rights
          reserved
        </Text>
        <ButtonGroup variant="ghost">
          <IconButton
            as="a"
            href="#"
            aria-label="LinkedIn"
            icon={<FaLinkedin fontSize="1.25rem" />}
          />

          <IconButton
            as="a"
            href="#"
            aria-label="Twitter"
            icon={<FaTwitter fontSize="1.25rem" />}
          />
        </ButtonGroup>
      </Stack>
    </Container>
  )
}

export default Footer
