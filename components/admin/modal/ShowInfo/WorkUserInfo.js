import { Box, Grid, GridItem, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import {} from '../../../../utils/error'

export default function WorkUserInfoTab({ id }) {
  const token = Cookies.get('userToken')

  const toast = useToast()

  const [userWorkInfo, setUserWorkInfo] = useState(null)

  const [provinceWork, setProvinceWork] = useState({ id: '', name: '' })

  const [cityWork, setCityWork] = useState({ id: '', name: '' })

  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    async function getProvince() {
      try {
        const { data } = await axios.get(
          `/api/province/findById/${provinceWork.id}`
        )

        if (data) {
          setProvinceWork(prev => ({ ...prev, name: data.province }))
        }
      } catch (err) {
        toast({
          title: err.message,
          status: 'error',
          isClosable: true
        })
      }
    }
    if (provinceWork.id) {
      getProvince()
    }
  }, [provinceWork.id])

  useEffect(() => {
    async function getCity() {
      try {
        const { data } = await axios.get(
          `/api/province/findById/city/${cityWork.id}`
        )

        if (data) {
          setCityWork(prev => ({ ...prev, name: data.city }))
        }
      } catch (err) {
        toast({
          title: err.message,
          status: 'error',
          isClosable: true
        })
      }
    }
    if (cityWork.id) {
      getCity()
    }
  }, [cityWork.id])

  useEffect(() => {
    async function getUserInfo() {
      try {
        const { data } = await axios.get(
          `/api/profile/workInfo/getInfo/${id}`,
          {
            headers: { authorization: `Bearer ${token}` }
          }
        )

        if (data) {
          setUserWorkInfo(data)
          setProvinceWork(prev => ({ ...prev, id: data.provinceId }))
          setCityWork(prev => ({ ...prev, id: data.cityId }))
        }
      } catch (err) {
        toast({
          title: err.message,
          status: 'error',
          isClosable: true
        })
      }
    }

    getUserInfo()
  }, [])

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="auto">
      {userWorkInfo && (
        <Box p="6">
          <Grid templateColumns="repeat(5, 1fr)">
            <GridItem colSpan={2} h="10">
              <Text as="em"> عنوان شغل :</Text>
            </GridItem>
            <GridItem colStart={3} colEnd={6} h="10" as="u">
              {userWorkInfo.work}
            </GridItem>
            <GridItem colSpan={2} h="10">
              <Text as="em"> نام محل کار : </Text>
            </GridItem>
            <GridItem colStart={3} colEnd={6} h="10" as="u">
              {userWorkInfo.workName}
            </GridItem>

            <GridItem colSpan={2} h="10">
              <Text as="em">استان محل کار : </Text>
            </GridItem>
            <GridItem colStart={3} colEnd={6} h="10" as="u">
              {provinceWork.name}
            </GridItem>

            <GridItem colSpan={2} h="10">
              <Text as="em">شهرستان محل کار : </Text>
            </GridItem>
            <GridItem colStart={3} colEnd={6} h="10" as="u">
              {cityWork.name}
            </GridItem>
          </Grid>
        </Box>
      )}
    </Box>
  )
}
