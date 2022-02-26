import { Box, Grid, GridItem, Text } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import useSWR from 'swr'

export default function PrivateInfoTab({ id, token }) {
  // const toast = useToast()

  const [userData, setUserData] = useState(null)

  const [province, setProvince] = useState({ id: '', name: '' })

  const [city, setCity] = useState({ id: '', name: '' })

  const fetcheUserPrivateInfo = async (url, token) => {
    await axios
      .get(url, { headers: { Authorization: 'Bearer ' + token } })
      .then(res => {
        setUserData(res.data)
        setProvince(prev => ({ ...prev, id: res.data.provinceId }))
        setCity(prev => ({ ...prev, id: res.data.cityId }))
      })
  }

  useSWR(
    !userData ? [`/api/profile/getInfo/${id}`, token] : null,
    fetcheUserPrivateInfo
  )

  const fetchePrivateProvince = async url => {
    await axios.get(url).then(res => {
      setProvince(prev => ({ ...prev, name: res.data.province }))
    })
  }
  useSWR(
    province.id ? [`/api/province/findById/${province.id}`] : null,
    fetchePrivateProvince
  )

  const fetchePrivateCity = async url => {
    await axios.get(url).then(res => {
      setCity(prev => ({ ...prev, name: res.data.city }))
    })
  }
  useSWR(
    city.id ? [`/api/province/findById/city/${city.id}`] : null,
    fetchePrivateCity
  )

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
