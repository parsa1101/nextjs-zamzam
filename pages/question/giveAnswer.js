import React, { useContext, useEffect } from 'react'
import dynamic from 'next/dynamic'

import db from '../../utils/db'
import Category from '../../models/category'

const Layout = dynamic(() => import('../../components/layouts/article'))
// const Cats = dynamic(() => import('../../components/categories/Cats'))
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
  Text,
  Container,
  Center,
  Image,
  Box,
  Flex
} from '@chakra-ui/react'
import { IoIosArrowRoundForward } from 'react-icons/io'
// import ShowQuestions from '../../components/question/ShowQuestions'
const ShowQuestions = dynamic(() =>
  import('../../components/question/ShowQuestions')
)
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import LayoutContext from '../../utils/Store'

export default function AnswerScreen() {
  const token = Cookies.get('userToken')

  const { isOpen, onOpen, onClose } = useDisclosure()

  const router = useRouter()

  const ctx = useContext(LayoutContext)

  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    function checkToken() {
      if (!token) {
        return router.push('/login?redirect=/question/giveAnswer')
      }
    }
    checkToken()
  }, [token])

  useEffect(() => {
    if (ctx.showDrawer) {
      onClose()
      ctx.setShowDrawer()
    }
  }, [ctx.showDrawer])

  return (
    <Layout>
      <Container>
        <Center my={6}>
          <Image src="/images/works/amembo_icon.png" alt="icon" />
        </Center>
      </Container>
      <Button
        mb={18}
        rightIcon={<IoIosArrowRoundForward />}
        colorScheme="blue"
        variant="outline"
        onClick={onOpen}
      >
        نمایش گروهبندی سوالات
      </Button>

      <Drawer placement="right" onClose={onClose} isOpen={isOpen} size="xl">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="5px">
            <Text fontSize="md">انتخاب سوالات مربوط به هر گروه:</Text>
          </DrawerHeader>
          <DrawerBody>{/* <Cats categories={categories} /> */}</DrawerBody>
        </DrawerContent>
      </Drawer>
      <Flex>
        <Box flex={1}>
          <ShowQuestions />
        </Box>
      </Flex>
    </Layout>
  )
}

export async function getServerSideProps() {
  await db.connect()
  const categories = await Category.find({ parrent_id: undefined }).lean()

  await db.disconnect()
  return {
    props: {
      categories: categories.map(db.convertCategoryToObj)
    }
  }
}
