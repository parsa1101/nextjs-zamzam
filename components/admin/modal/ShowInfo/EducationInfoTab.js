import { Box, Grid, GridItem, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { getError } from '../../../../utils/error'

export default function EducationInfoTab({ id }) {
  const token = Cookies.get('userToken')

  const toast = useToast()

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
  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    async function getProvince() {
      try {
        const { data } = await axios.get(
          `/api/province/findById/${provinceEdu.id}`
        )

        if (data) {
          setProvinceEdu(prev => ({ ...prev, name: data.province }))
        }
      } catch (err) {
        toast({
          title: getError(err),
          status: 'error',
          isClosable: true
        })
      }
    }
    if (provinceEdu.id) {
      getProvince()
    }
  }, [provinceEdu.id])

  useEffect(() => {
    async function getCity() {
      try {
        const { data } = await axios.get(
          `/api/province/findById/city/${cityEdu.id}`
        )

        if (data) {
          setCityEdu(prev => ({ ...prev, name: data.city }))
        }
      } catch (err) {
        toast({
          title: getError(err),
          status: 'error',
          isClosable: true
        })
      }
    }
    if (cityEdu.id) {
      getCity()
    }
  }, [cityEdu.id])

  useEffect(() => {
    async function getUserInfo() {
      try {
        const { data } = await axios.get(
          `/api/profile/educationInfo/getInfo/${id}`,
          {
            headers: { authorization: `Bearer ${token}` }
          }
        )

        if (data) {
          setUserEduData(data)
          setProvinceEdu(prev => ({ ...prev, id: data.provinceId }))
          setCityEdu(prev => ({ ...prev, id: data.cityId }))
        }
      } catch (err) {
        toast({
          title: getError(err),
          status: 'error',
          isClosable: true
        })
      }
    }

    getUserInfo()
  }, [])
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
