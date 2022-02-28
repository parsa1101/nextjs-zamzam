import Logo from './logo'
import NextLink from 'next/link'
import {
  Container,
  Box,
  Link,
  Stack,
  Heading,
  Flex,
  Menu,
  MenuItem,
  MenuList,
  MenuButton,
  IconButton,
  useColorModeValue,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import ThemeToggleButton from './theme-toggle-button'
import Cookies from 'js-cookie'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import DrawerCategory from './DrawerCategory'

const GroupDrawer = ({ toggle, isOpen }) => {
  const menuItems = JSON.parse(Cookies.get('menuItems'))

  return (
    <Drawer placement="right" onClose={toggle} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">گروهبندی احکام:</DrawerHeader>
        <DrawerBody>
          <DrawerCategory categories={menuItems} toggle={toggle} />
          {/* {menuItems.map(item => (
            <List spacing={5} key={item._id}>
              <ListItem
                m={5}
                cursor="pointer"
               
              >
                <NextLink href={`/question/category/${item._id}`} passHref>
                  <Link onClick={toggle}>
                    <Text color="gray">
                      <ListIcon color={'green.500'} size="md">
                        <FaLayerGroup />
                      </ListIcon>
                      {item.name}
                    </Text>
                  </Link>
                </NextLink>
              </ListItem>
            </List>
          ))} */}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
const LinkItem = ({ href, path, _target, children, ...props }) => {
  const active = path === href
  const inactiveColor = useColorModeValue('gray200', 'whiteAlpha.900')

  return (
    <NextLink href={href} passHref>
      <Link
        p={2}
        bg={active ? 'grassTeal' : undefined}
        color={active ? '#202023' : inactiveColor}
        _target={_target}
        {...props}
      >
        {children}
      </Link>
    </NextLink>
  )
}

const Navbar = props => {
  const { path } = props

  const userId = Cookies.get('userId')
  const token = Cookies.get('userToken')
  const isExpert = Cookies.get('isExpert')
  const isAdmin = Cookies.get('isAdmin')

  const [showDrawer1, setShowDrawer1] = useState(false)
  const [showDrawer2, setShowDrawer2] = useState(false)

  const router = useRouter()

  function toggleDrawer1() {
    setShowDrawer1(!showDrawer1)
  }

  function toggleDrawer2() {
    setShowDrawer2(!showDrawer2)
  }

  const logoutHandler = async () => {
    if (userId) {
      await axios.post(
        `/api/auth/${userId}`,
        {
          token: '0'
        },
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
    }

    Cookies.remove('userId')
    Cookies.remove('userToken')
    router.push('/')
  }

  return (
    <Box
      position="fixed"
      as="nav"
      w="100%"
      bg={useColorModeValue('#ffffff40', '#20202380')}
      css={{ backdropFilter: 'blur(10px)' }}
      zIndex={1}
      {...props}
    >
      <Container
        display="flex"
        p={2}
        maxW="container.md"
        wrap="wrap"
        align="center"
        justify="space-between"
      >
        <Flex align="center" mr={5}>
          <Heading as="h1" size="lg" letterSpacing={'tighter'}>
            <Logo />
          </Heading>
        </Flex>

        <Stack
          direction={{ base: 'column', md: 'row' }}
          display={{ base: 'none', md: 'flex' }}
          width={{ base: 'full', md: 'auto' }}
          alignItems="center"
          flexGrow={1}
          mt={{ base: 4, md: 0 }}
        >
          {!userId && (
            <LinkItem href="/login" path={path}>
              عضویت/ورود
            </LinkItem>
          )}

          <Button variant="ghost" onClick={toggleDrawer1}>
            گروهبندی احکام
          </Button>
          {showDrawer1 && (
            <GroupDrawer toggle={toggleDrawer1} isOpen={showDrawer1} />
          )}

          {userId && (
            <Menu isLazy>
              <MenuButton>اطلاعات کاربری</MenuButton>
              <MenuList>
                {isAdmin && (
                  <LinkItem
                    _target="_blank"
                    href="/admin/dashboard"
                    display="inline-flex"
                    alignItems="center"
                    style={{ gap: 4 }}
                    pl={2}
                  >
                    ورود به پنل ادمین
                  </LinkItem>
                )}
                <LinkItem
                  _target="_blank"
                  href="/wizard"
                  display="inline-flex"
                  alignItems="center"
                  style={{ gap: 4 }}
                  pl={2}
                >
                  ثبت اطلاعات به عنوان کارشناس
                </LinkItem>
                <MenuItem>
                  <LinkItem
                    _target="_blank"
                    href="/myAccount"
                    display="inline-flex"
                    alignItems="center"
                    style={{ gap: 4 }}
                    pl={2}
                    path={path}
                  >
                    ویرایش اطلاعات کاربری
                  </LinkItem>
                </MenuItem>

                {isExpert && (
                  <MenuItem>
                    <LinkItem
                      _target="_blank"
                      href="/expert/showCategory"
                      display="inline-flex"
                      alignItems="center"
                      style={{ gap: 4 }}
                      pl={2}
                      path={path}
                    >
                      پاسخگویی به سوالات
                    </LinkItem>
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          )}
          {userId && (
            <Button variant="ghost" onClick={logoutHandler}>
              خروج
            </Button>
          )}
        </Stack>

        <Box flex={1} align="right">
          <ThemeToggleButton />

          <Box ml={2} display={{ base: 'inline-block', md: 'none' }}>
            <Menu isLazy id="navbar-menu">
              <MenuButton
                as={IconButton}
                icon={<HamburgerIcon />}
                variant="outline"
                aria-label="Options"
              />
              <MenuList>
                {!userId && (
                  <NextLink href="/login" passHref>
                    <MenuItem as={Link}> عضویت/ورود</MenuItem>
                  </NextLink>
                )}

                <Button variant="ghost" onClick={toggleDrawer2}>
                  گروهبندی احکام
                </Button>
                {showDrawer2 && (
                  <GroupDrawer toggle={toggleDrawer2} isOpen={showDrawer2} />
                )}

                {userId && <SubMenu isExpert={isExpert} />}
                {userId && (
                  <Button variant="ghost" onClick={logoutHandler}>
                    خروج
                  </Button>
                )}
                <hr />
              </MenuList>
            </Menu>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
const SubMenu = ({ isExpert }) => {
  return (
    <Accordion allowToggle>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              اطلاعات کاربری
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <LinkItem
            _target="_blank"
            href="/myAccount"
            display="inline-flex"
            alignItems="center"
            style={{ gap: 4 }}
            pl={2}
          >
            ویرایش اطلاعات کاربری
          </LinkItem>
          <hr />
          <LinkItem
            _target="_blank"
            href="/wizard"
            display="inline-flex"
            alignItems="center"
            style={{ gap: 4 }}
            pl={2}
          >
            ثبت اطلاعات به عنوان کارشناس
          </LinkItem>
          <hr />
          {isExpert && (
            <LinkItem
              _target="_blank"
              href="/expert/showCategory"
              display="inline-flex"
              alignItems="center"
              style={{ gap: 4 }}
              pl={2}
            >
              پاسخگویی به سوالات
            </LinkItem>
          )}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
export default Navbar
