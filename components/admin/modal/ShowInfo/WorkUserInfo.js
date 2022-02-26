import { Box, Grid, GridItem, Text } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import useSWR from 'swr'

export default function WorkUserInfoTab({ id, token }) {
  // const toast = useToast()

  const [userWorkInfo, setUserWorkInfo] = useState(null)

  const [provinceWork, setProvinceWork] = useState({ id: '', name: '' })

  const [cityWork, setCityWork] = useState({ id: '', name: '' })

  const fetcheUserWorkInfo = async (url, token) => {
    await axios
      .get(url, { headers: { Authorization: 'Bearer ' + token } })
      .then(res => {
        setUserWorkInfo(res.data)
        setProvinceWork(prev => ({ ...prev, id: res.data.provinceId }))
        setCityWork(prev => ({ ...prev, id: res.data.cityId }))
      })
  }
  useSWR(
    !userWorkInfo ? [`/api/profile/workInfo/getInfo/${id}`, token] : null,
    fetcheUserWorkInfo
  )

  const fetcheWorkProvince = async url => {
    await axios.get(url).then(res => {
      setProvinceWork(prev => ({ ...prev, name: res.data.province }))
    })
  }
  useSWR(
    provinceWork.id ? [`/api/province/findById/${provinceWork.id}`] : null,
    fetcheWorkProvince
  )

  const fetchWorkCity = async url => {
    await axios.get(url).then(res => {
      setCityWork(prev => ({ ...prev, name: res.data.city }))
    })
  }
  useSWR(
    cityWork.id ? [`/api/province/findById/city/${cityWork.id}`] : null,
    fetchWorkCity
  )

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
