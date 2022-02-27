import React from 'react'
import {
  Flex,
  Container,
  Image,
  Stack,
  Text,
  Icon,
  Button,
  Menu,
  MenuItem,
  MenuDivider,
  MenuGroup,
  MenuList,
  MenuButton
} from '@chakra-ui/react'

import NextLink from 'next/link'

import { FiUsers, FiHome } from 'react-icons/fi'
import { TiDocumentText } from 'react-icons/ti'
import { MdCategory } from 'react-icons/md'
import { FaUserSecret } from 'react-icons/fa'

export default function Nav() {
  return (
    <Flex
      // position={{ md: 'fixed' }}
      bg="#ffffff"
      minH="4rem"
      w="100%"
      marginTop={{ md: '-4rem' }}
      zIndex="99"
    >
      <Container maxW="container.lg" paddingTop="2px">
        <Stack
          direction={['column', 'row']}
          alignItems={['flex-end', 'center']}
        >
          <Image
            boxSize="54px"
            alt="fjjgj"
            fallbackSrc="https://user-images.githubusercontent.com/10295466/95871054-e472de00-0d75-11eb-93f4-2593ce275869.png"
          />
          <NextLink href="/" passHref>
            {/* <Link> */}
            <Text fontSize="xl" fontWeight="500">
              zam zam Ahkam
            </Text>
            {/* </Link> */}
          </NextLink>

          <Stack direction={['column', 'row']} style={{ marginLeft: 'auto' }}>
            <Button
              colorScheme="navItem"
              variant="ghost"
              rightIcon={<Icon as={FiHome} color="navItem.500" />}
            >
              <NextLink href={'/admin/dashboard'}>داشبورد</NextLink>
            </Button>

            <Menu>
              <MenuButton
                as={Button}
                colorScheme="navItem"
                variant="ghost"
                rightIcon={<Icon as={TiDocumentText} color="navItem.500" />}
              >
                احکام
              </MenuButton>
              <MenuList>
                <MenuGroup title="احکام">
                  <MenuItem>
                    {' '}
                    <NextLink href="/admin/questions">نمایش احکام</NextLink>
                  </MenuItem>
                  <MenuItem>
                    <NextLink href="/admin/questions/create">
                      ثبت احکام جدید
                    </NextLink>{' '}
                  </MenuItem>
                </MenuGroup>
                <MenuDivider />
                <MenuGroup title="احکام جدید">
                  <MenuItem>
                    <NextLink href="/admin/questions/temp">
                      نمایش سوالات مطرح شده
                    </NextLink>{' '}
                  </MenuItem>
                </MenuGroup>
              </MenuList>
            </Menu>
          </Stack>

          <Stack direction={['column', 'row']} style={{ marginLeft: 'auto' }}>
            <Button
              colorScheme="navItem"
              variant="ghost"
              rightIcon={<Icon as={FiUsers} color="navItem.500" />}
            >
              <NextLink href={'/admin/users'}>کاربران</NextLink>
            </Button>
            <Menu>
              <MenuButton
                as={Button}
                colorScheme="navItem"
                variant="ghost"
                rightIcon={<Icon as={MdCategory} color="navItem.500" />}
              >
                دسته بندی ها
              </MenuButton>
              <MenuList>
                <MenuGroup>
                  <MenuItem>
                    <NextLink href={'/admin/category'}>
                      نمایش دسته بندی ها
                    </NextLink>
                  </MenuItem>
                  <MenuItem>
                    <NextLink href={'/admin/category/insert'}>
                      ایجاد دسته بندی
                    </NextLink>{' '}
                  </MenuItem>
                </MenuGroup>
                <MenuDivider />
              </MenuList>
            </Menu>
          </Stack>
          <Stack direction={['column', 'row']} style={{ marginLeft: 'auto' }}>
            <Menu>
              <MenuButton
                as={Button}
                colorScheme="navItem"
                variant="ghost"
                rightIcon={<Icon as={FaUserSecret} color="navItem.500" />}
              >
                نقش ها
              </MenuButton>
              <MenuList>
                <MenuGroup>
                  <MenuItem>
                    <NextLink href={'/admin/roles'}>نمایش نقش ها</NextLink>
                  </MenuItem>
                  <MenuItem>
                    <NextLink href={'/admin/roles/insert'}>
                      ایجاد نقش جدید
                    </NextLink>{' '}
                  </MenuItem>
                </MenuGroup>
                <MenuDivider />
              </MenuList>
            </Menu>
          </Stack>
        </Stack>
      </Container>
    </Flex>
  )
}
