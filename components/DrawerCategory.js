import * as React from 'react'

import {
  Box,
  SimpleGrid,
  Icon,
  VStack,
  useColorModeValue,
  Text,
  Link
} from '@chakra-ui/react'
import { FaLayerGroup } from 'react-icons/fa'
import NextLink from 'next/link'

export default function DrawerCategory({ categories, toggle }) {
  const accentColor = useColorModeValue('blue.600', 'blue.200')

  return (
    <Box as="section" bg={'#ede0d4'}>
      <SimpleGrid
        columns="1"
        spacing={{ base: '8', lg: '0' }}
        maxW="7xl"
        mx="auto"
        justifyItems="center"
        alignItems="center"
      >
        {categories.map((item, index) => (
          <Box
            key={index}
            position="relative"
            px="6"
            pb="6"
            pt="16"
            overflow="hidden"
            shadow="lg"
            maxW="md"
            width="100%"
            rounded={{ sm: 'xl' }}
            mt="5"
            bg={'#e6ccb2'}
          >
            <VStack spacing={6}>
              <Icon
                aria-hidden
                as={FaLayerGroup}
                fontSize="2xl"
                color={accentColor}
              />
              <NextLink href={`/question/category/${item._id}`} passHref>
                <Link onClick={toggle}>
                  <Text color="gray">{item.name}</Text>
                </Link>
              </NextLink>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  )
}
