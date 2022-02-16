import NextLink from 'next/link'
import dynamic from 'next/dynamic'
import {
  Container,
  Heading,
  Box,
  Image,
  SimpleGrid,
  Button,
  useColorModeValue
} from '@chakra-ui/react'
import { ChevronLeftIcon } from '@chakra-ui/icons'

const Layout = dynamic(() => import('../components/layouts/article'))

const Section = dynamic(() => import('../components/section'))

import db from '../utils/db'
import Question from '../models/question'

import {
  AppContainer,
  ExtraInfo,
  Item
} from '../components/carousel/components'
const Carousel = dynamic(() => import('../components/carousel/Carousel'))
const Paragraph = dynamic(() => import('../components/paragraph'))
const Home = ({ questions }) => {
  return (
    <Layout>
      <Container>
        <Box
          borderRadius="lg"
          mb={10}
          p={10}
          textAlign="center"
          bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
        >
          با سلام ! به سایت زمزم احکام خوش آمدید
        </Box>

        <Box display={{ md: 'flex' }}>
          <Box flexGrow={1}>
            <Heading as="h6" variant="section-title">
              پاسخگویی به سوالات شرعی
            </Heading>
            <p>توسط کارشناسان متخصص </p>
          </Box>
          <Box
            flexShrink={0}
            mt={{ base: 4, md: 15 }}
            ml={{ md: 6 }}
            textAlign="center"
          >
            <Image
              borderColor="whiteAlpha.800"
              borderWidth={2}
              borderStyle="solid"
              maxWidth="100px"
              display="inline-block"
              borderRadius="full"
              src="/images/zamZam.jpg"
              alt="Profile image"
            />
          </Box>
        </Box>

        <Section delay={0.1}>
          <Heading as="h6" variant="section-title">
            معرفی سایت:
          </Heading>
          <Paragraph>
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با
            استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در
            ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز،
            و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای
            زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و
            متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان
            رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد
            کرد، در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه
            راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل
            حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود
            طراحی اساسا مورد استفاده قرار گیرد.
          </Paragraph>
          <Box align="center" my={4}>
            <NextLink href="/aboutUs">
              <Button rightIcon={<ChevronLeftIcon />} colorScheme="teal">
                ادامه مطلب
              </Button>
            </NextLink>
          </Box>
        </Section>

        <Section delay={0.3}>
          <SimpleGrid columns={1} gap={6}>
            <AppContainer>
              <Carousel title="Carousel" axis="x-reverse">
                {questions.map((value, index) => (
                  <NextLink key={index} href={`question/${value.slug}`}>
                    <Item img={value.pic_path} />
                  </NextLink>
                ))}
              </Carousel>
              <ExtraInfo>
                <p>
                  <NextLink href="/posts">
                    <Button rightIcon={<ChevronLeftIcon />} colorScheme="teal">
                      جدیدترین احکام
                    </Button>
                  </NextLink>
                </p>
              </ExtraInfo>
            </AppContainer>
          </SimpleGrid>
        </Section>
      </Container>
    </Layout>
  )
}
export default Home

export async function getStaticProps() {
  await db.connect()
  const questions = await Question.find({ status: true })
    .sort({ createdAt: -1 })

    .lean()

  await db.disconnect()
  return {
    props: {
      questions: questions.map(db.convertDocToObj)
    }
  }
}
