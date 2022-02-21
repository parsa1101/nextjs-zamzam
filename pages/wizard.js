import React from 'react'
import dynamic from 'next/dynamic'
import { Container, Heading, SimpleGrid } from '@chakra-ui/react'

import db from '../utils/db'
import EducationInfo from '../models/educationInfo'
import Profile from '../models/profile'
import WorkInfo from '../models/workInfo'
import Province from '../models/province'
import City from '../models/city'

const WizardInfo = dynamic(() => import('../components/Wizard/WizardInfo'))
const Section = dynamic(() => import('../components/section'))
const Layout = dynamic(() => import('../components/layouts/article'))

export default function Wizard({
  userId,
  userInfo,
  userEduInfo,
  userWorkInfo,
  provinces,
  profileCities,
  eduCities,
  workCities
}) {
  return (
    <Layout title="Works">
      <Container>
        <Heading as="h3" fontSize={20} mb={4}>
          ثبت / ویرایش اطلاعات
        </Heading>

        <Section>
          <SimpleGrid columns={[1, 1, 1]} gap={6}>
            {userId && (
              <WizardInfo
                userId={userId}
                userInfo={userInfo}
                userEduInfo={userEduInfo}
                userWorkInfo={userWorkInfo}
                provinces={provinces}
                profileCities={profileCities}
                eduCities={eduCities}
                workCities={workCities}
              />
            )}
          </SimpleGrid>
        </Section>
      </Container>
    </Layout>
  )
}
export async function getServerSideProps(context) {
  const userId = context.req.cookies['userId']

  if (!userId) {
    return {
      redirect: {
        permanent: false,
        destination: '/login?redirect=/wizard'
      },
      props: {}
    }
  }

  await db.connect()
  const userInfo = await Profile.findOne({ userId: userId }).lean()
  const userEduInfo = await EducationInfo.findOne({ userId: userId }).lean()
  const userWorkInfo = await WorkInfo.findOne({ userId: userId }).lean()
  const provinces = await Province.find({}).lean()
  const profileCities = []
  const eduCities = []
  const workCities = []

  let getCities = []
  let city

  if (userInfo != null && userEduInfo != null && userWorkInfo != null) {
    const provinceProfile = await Province.findById(
      userInfo.provinceId.toString()
    )
    const provinceEdu = await Province.findById(
      userEduInfo.provinceId.toString()
    )
    const provinceWork = await Province.findById(
      userWorkInfo.provinceId.toString()
    )

    getCities = provinceProfile.cityId
    for (var i = 0, len = getCities.length; i < len; i++) {
      city = await City.findById(getCities[i]).lean()
      profileCities.push(city)
    }

    getCities = provinceEdu.cityId
    for (let i = 0, len = getCities.length; i < len; i++) {
      city = await City.findById(getCities[i]).lean()
      eduCities.push(city)
    }

    getCities = provinceWork.cityId
    for (let i = 0, len = getCities.length; i < len; i++) {
      city = await City.findById(getCities[i]).lean()
      workCities.push(city)
    }
    await db.disconnect()
    return {
      props: {
        userInfo: db.convertOtherToObject(userInfo),
        userEduInfo: db.convertOtherToObject(userEduInfo),
        userWorkInfo: db.convertOtherToObject(userWorkInfo),
        provinces: provinces.map(db.convertOtherToObject),
        profileCities: profileCities.map(db.convertOtherToObject),
        eduCities: eduCities.map(db.convertOtherToObject),
        workCities: workCities.map(db.convertOtherToObject),
        userId
      }
    }
  }
  return {
    props: {
      userInfo: null,
      userEduInfo: null,
      userWorkInfo: null,
      provinces: provinces.map(db.convertOtherToObject),
      profileCities: [],
      eduCities: [],
      workCities: [],
      userId
    }
  }
}
