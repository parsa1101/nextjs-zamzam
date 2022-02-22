import React, { useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'

import Cookies from 'js-cookie'

import {
  Button,
  CircularProgress,
  FormLabel,
  Stack,
  useToast
} from '@chakra-ui/react'
import { Select } from '@chakra-ui/select'
import {
  FormErrorMessage,
  FormControl,
  Input,
  Flex,
  Box
} from '@chakra-ui/react'

export default function WorkInfo({
  userId,
  userWorkInfo,
  workProvinces,
  userWorkCities
}) {
  const [workCities, setWorkCities] = useState(userWorkCities)

  const toast = useToast()
  const [workCityLoading, setWorkCityLoding] = useState(false)

  const [userWorkData, setUserWorkData] = useState({
    work: userWorkInfo ? userWorkInfo.work : '',
    workName: userWorkInfo ? userWorkInfo.workName : '',
    provinceId: userWorkInfo ? userWorkInfo.provinceId : 'DEFAULT',
    cityId: userWorkInfo ? userWorkInfo.cityId : 'DEFAULT'
  })

  const token = Cookies.get('userToken')
  const {
    handleSubmit,
    register,

    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      work: userWorkInfo ? userWorkInfo.work : '',
      workName: userWorkInfo ? userWorkInfo.workName : '',
      provinceId: userWorkInfo ? userWorkInfo.provinceId : '',
      cityId: userWorkInfo ? userWorkInfo.cityId : ''
    }
  })

  const onWorkSubmit = async ({ work, workName }) => {
    try {
      await axios.post(
        `/api/profile/workInfo/setInfo`,
        {
          userId,
          work,
          workName,
          provinceId: userWorkData.provinceId,
          cityId: userWorkData.cityId
        },
        { headers: { authorization: `Bearer ${token}` } }
      )
      toast({
        title: 'کاربر گرامی ! اطلاعات شغلی شما با موفقیت ثبت گردید.',
        status: 'success',
        isClosable: true
      })
    } catch (err) {
      toast({
        title: err.message,
        status: 'error',
        isClosable: true
      })
    }
  }

  const handleWorkProvinceValue = async e => {
    setWorkCityLoding(true)
    setUserWorkData(prev => ({
      ...prev,
      provinceId: e.target.value
    }))
    try {
      const { data } = await axios.get(`/api/province/${e.target.value}`)
      setWorkCities(data)
    } catch (err) {
      toast({
        title: err.message,
        status: 'error',
        isClosable: true
      })
    }
    setWorkCityLoding(false)
  }

  const handleWorkCityValue = e => {
    setUserWorkData(prev => ({
      ...prev,
      cityId: e.target.value
    }))
  }
  return (
    <Flex width="full" align="center" justifyContent="center" mt={5}>
      <Box
        p={10}
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        w={[500, 600, 700]}
      >
        <form onSubmit={handleSubmit(onWorkSubmit)}>
          <FormControl isInvalid={errors.work}>
            <FormLabel htmlFor="work  "> شغل: </FormLabel>
            <Input
              _placeholder={{ color: '#457b9d' }}
              onChange={e => {
                setUserWorkData(prev => ({
                  ...prev,
                  work: e.target.value
                }))
              }}
              id="work"
              placeholder="شغل"
              {...register('work', {
                required: {
                  value: true,
                  message: 'لطفا شغل را وارد نمایید!'
                },
                minLength: {
                  value: 4,
                  message: 'حداقل طول شغل 4 کاراکتر است'
                },
                pattern: {
                  value: /^[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی ]+$/,
                  message: 'لطفا شغل را به فارسی وارد نمایید'
                }
              })}
            />
            <FormErrorMessage>
              {errors.work && errors.work.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.workName}>
            <FormLabel htmlFor="workName">نام محل کار</FormLabel>
            <Input
              _placeholder={{ color: '#457b9d' }}
              onChange={e => {
                setUserWorkData(prev => ({
                  ...prev,
                  workName: e.target.value
                }))
              }}
              id="workName"
              placeholder=" نام محل کار"
              {...register('workName', {
                required: {
                  value: true,
                  message: 'لطفا نام محل کار را وارد نمایید!'
                },
                minLength: {
                  value: 3,
                  message: 'حداقل طول نام محل کار 3 کاراکتر است'
                },
                pattern: {
                  value: /^[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی ]+$/,
                  message: 'لطفا نام محل کار را به فارسی وارد نمایید'
                }
              })}
            />
            <FormErrorMessage>
              {errors.workName && errors.workName.message}
            </FormErrorMessage>
          </FormControl>

          <Stack spacing={3}>
            <FormLabel>استان محل کار </FormLabel>
            <Select
              focusBorderColor="#457b9d"
              color="#457b9d"
              value={userWorkData.provinceId}
              id="province"
              size="lg"
              onChange={handleWorkProvinceValue}
            >
              <option value="DEFAULT" disabled>
                لطفا استان را انتخاب نمایید ...
              </option>

              {workProvinces.map((item, index) => (
                <option key={index} value={item._id}>
                  {item.province}
                </option>
              ))}
            </Select>
            <FormLabel> شهرستان محل کار </FormLabel>
            <Select
              focusBorderColor="#457b9d"
              color="#457b9d"
              value={userWorkData.cityId}
              id="city"
              size="lg"
              onChange={handleWorkCityValue}
              icon={
                workCityLoading && (
                  <CircularProgress
                    isIndeterminate
                    thickness="1px"
                    color="green.300"
                  />
                )
              }
            >
              <option value="DEFAULT" disabled>
                لطفا شهرستان را انتخاب نمایید ...
              </option>

              {workCities.map((item, index) => (
                <option key={index} value={item._id}>
                  {item.city}
                </option>
              ))}
            </Select>

            <Button
              isLoading={isSubmitting}
              type="submit"
              bg={'#457b9d'}
              color={'white'}
              w="full"
              _hover={{
                bg: 'blue.500'
              }}
            >
              ثبت اطلاعات شغلی
            </Button>
          </Stack>
        </form>
      </Box>
    </Flex>
  )
}
