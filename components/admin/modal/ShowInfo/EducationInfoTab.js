import { Box, Grid, GridItem, Text } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import useSWR from 'swr'

export default function EducationInfoTab({ id, token }) {
  // const toast = useToast()

  const [userEduData, setUserEduData] = useState(null)

  const [provinceEdu, setProvinceEdu] = useState({ id: '', name: '' })

  const [cityEdu, setCityEdu] = useState({ id: '', name: '' })

  const evidences = [
    { name: 'زیردیپلم', value: '0' },
    { name: 'دیپلم', value: '1' },
    { name: 'فوق دیپلم', value: '2' },
    { name: 'کارشناسی', value: '3' },
    { name: 'کارشناسی ارشد', value: '4' },
    { name: 'دکتری', value: '5' }
  ]

  const fetcheUserEduInfo = async (url, token) => {
    await axios
      .get(url, { headers: { Authorization: 'Bearer ' + token } })
      .then(res => {
        setUserEduData(res.data)
        setProvinceEdu(prev => ({ ...prev, id: res.data.provinceId }))
        setCityEdu(prev => ({ ...prev, id: res.data.cityId }))
      })
  }
  useSWR(
    !userEduData ? [`/api/profile/educationInfo/getInfo/${id}`, token] : null,
    fetcheUserEduInfo
  )

  const fetcheProvince = async url => {
    await axios.get(url).then(res => {
      setProvinceEdu(prev => ({ ...prev, name: res.data.province }))
    })
  }
  useSWR(
    provinceEdu.id ? [`/api/province/findById/${provinceEdu.id}`] : null,
    fetcheProvince
  )

  const fetcheCity = async url => {
    await axios.get(url).then(res => {
      setCityEdu(prev => ({ ...prev, name: res.data.city }))
    })
  }
  useSWR(
    cityEdu.id ? [`/api/province/findById/city/${cityEdu.id}`] : null,
    fetcheCity
  )

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="auto">
      {userEduData && (
        <Box p="6">
          <Grid templateColumns="repeat(5, 1fr)">
            <GridItem colSpan={2} h="10">
              <Text as="em">رشته تحصیلی :</Text>
            </GridItem>
            <GridItem colStart={3} colEnd={6} h="10" as="u">
              {userEduData.major}
            </GridItem>
            <GridItem colSpan={2} h="10">
              <Text as="em"> نام دانشگاه : </Text>
            </GridItem>
            <GridItem colStart={3} colEnd={6} h="10" as="u">
              {userEduData.universityName}
            </GridItem>
            <GridItem colSpan={2} h="10">
              <Text as="em">مدرک : </Text>
            </GridItem>
            <GridItem colStart={3} colEnd={6} h="10" as="u">
              {evidences[+userEduData.evidence].name}
            </GridItem>

            <GridItem colSpan={2} h="10">
              <Text as="em">وضعیت تحصیلی : </Text>
            </GridItem>
            <GridItem colStart={3} colEnd={6} h="10" as="u">
              {userEduData.educationStatus ? 'در حال تحصیل' : 'فارغ التحصیل'}
            </GridItem>

            <GridItem colSpan={2} h="10">
              <Text as="em">استان محل تحصیل : </Text>
            </GridItem>
            <GridItem colStart={3} colEnd={6} h="10" as="u">
              {provinceEdu.name}
            </GridItem>

            <GridItem colSpan={2} h="10">
              <Text as="em">شهرستان محل تحصیل : </Text>
            </GridItem>
            <GridItem colStart={3} colEnd={6} h="10" as="u">
              {cityEdu.name}
            </GridItem>
          </Grid>
        </Box>
      )}
    </Box>
  )
}
