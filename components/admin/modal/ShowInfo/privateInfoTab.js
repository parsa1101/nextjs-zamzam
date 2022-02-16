import { Box, Grid, GridItem, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { getError } from '../../../../utils/error'

export default function PrivateInfoTab({ id }) {
  const token = Cookies.get('userToken')

  const toast = useToast()

  const [userData, setUserData] = useState(null)

  const [province, setProvince] = useState({ id: '', name: '' })

  const [city, setCity] = useState({ id: '', name: '' })

  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    async function getProvince() {
      try {
        const { data } = await axios.get(
          `/api/province/findById/${province.id}`
        )

        if (data) {
          setProvince(prev => ({ ...prev, name: data.province }))
        }
      } catch (err) {
        toast({
          title: getError(err),
          status: 'error',
          isClosable: true
        })
      }
    }
    if (province.id) {
      getProvince()
    }
  }, [province.id])

  useEffect(() => {
    async function getCity() {
      try {
        const { data } = await axios.get(
          `/api/province/findById/city/${city.id}`
        )

        if (data) {
          setCity(prev => ({ ...prev, name: data.city }))
        }
      } catch (err) {
        toast({
          title: getError(err),
          status: 'error',
          isClosable: true
        })
      }
    }
    if (city.id) {
      getCity()
    }
  }, [city.id])

  useEffect(() => {
    async function getUserInfo() {
      try {
        const { data } = await axios.get(`/api/profile/getInfo/${id}`, {
          headers: { authorization: `Bearer ${token}` }
        })

        if (data) {
          setUserData(data)
          setProvince(prev => ({ ...prev, id: data.provinceId }))
          setCity(prev => ({ ...prev, id: data.cityId }))
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
      {userData && (
        <Box p="6">
          <Grid templateColumns="repeat(5, 1fr)">
            <GridItem colSpan={2} h="10">
              <Text as="em">نام و نام خانوادگی :</Text>
            </GridItem>
            <GridItem colStart={3} colEnd={6} h="10" as="u">
              {userData.nameFamily}
            </GridItem>
            <GridItem colSpan={2} h="10">
              <Text as="em"> تلفن تماس : </Text>
            </GridItem>
            <GridItem colStart={3} colEnd={6} h="10" as="u">
              {userData.homePhone}
            </GridItem>
            <GridItem colSpan={2} h="10">
              <Text as="em">آدرس : </Text>
            </GridItem>
            <GridItem colStart={3} colEnd={6} h="10" as="u">
              {userData.homeAddress}
            </GridItem>

            <GridItem colSpan={2} h="10">
              <Text as="em">استان : </Text>
            </GridItem>
            <GridItem colStart={3} colEnd={6} h="10" as="u">
              {province.name}
            </GridItem>

            <GridItem colSpan={2} h="10">
              <Text as="em">شهرستان : </Text>
            </GridItem>
            <GridItem colStart={3} colEnd={6} h="10" as="u">
              {city.name}
            </GridItem>
          </Grid>
        </Box>
      )}
    </Box>
  )
}
