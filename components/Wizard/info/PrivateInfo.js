import React, { useState } from 'react'
import axios from 'axios'

import { useForm } from 'react-hook-form'

import {
  Button,
  FormLabel,
  Stack,
  Switch,
  Textarea,
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
import Cookies from 'js-cookie'

export default function PrivateInfo({
  userId,
  userInfo,
  provinces,
  profileCities
}) {
  const [provinceValue, setProvinceValue] = useState(
    userInfo ? userInfo.provinceId : ''
  )
  const [cityValue, setCityValue] = useState(userInfo ? userInfo.cityId : '')

  const [cities, setCities] = useState(profileCities)

  const [userData, setUserData] = useState({
    nameFamily: userInfo ? userInfo.nameFamily : '',
    homePhone: userInfo ? userInfo.homePhone : '',
    homeAddress: userInfo ? userInfo.homeAddress : '',
    male: userInfo ? userInfo.male : '',
    married: userInfo ? userInfo.married : ''
  })

  const toast = useToast()

  const {
    handleSubmit,
    register,

    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      nameFamily: userInfo ? userInfo.nameFamily : '',
      homePhone: userInfo ? userInfo.homePhone : '',
      homeAddress: userInfo ? userInfo.homeAddress : ''
    }
  })

  const token = Cookies.get('userToken')

  const onSubmit = async values => {
    try {
      await axios.post(
        `/api/profile/setInfo`,
        {
          userId,
          nameFamily: values.nameFamily,
          homePhone: values.homePhone,
          homeAddress: values.homeAddress,
          male: userData.male,
          married: userData.married,
          provinceId: provinceValue,
          cityId: cityValue
        },
        { headers: { authorization: `Bearer ${token}` } }
      )
      toast({
        title: 'کاربر گرامی ! اطلاعات شما با موفقیت ثبت گردید.',
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
  const handleProvinceValue = async e => {
    setProvinceValue(e.target.value)
    try {
      const { data } = await axios.get(`/api/province/${e.target.value}`)
      setCities(data)
    } catch (err) {
      toast({
        title: err.message,
        status: 'error',
        isClosable: true
      })
    }
  }
  const handleCityValue = e => {
    setCityValue(e.target.value)
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.nameFamily}>
            <FormLabel htmlFor="nameFamily  ">نام و نام خانوادگی</FormLabel>
            <Input
              _placeholder={{ color: '#457b9d' }}
              onChange={e => {
                setUserData(prev => ({
                  ...prev,
                  nameFamily: e.target.value
                }))
              }}
              id="nameFamily"
              placeholder="نام و نام خانوادگی"
              {...register('nameFamily', {
                required: {
                  value: true,
                  message: 'لطفا نام و نام خانوادگی را وارد نمایید!'
                },
                minLength: {
                  value: 6,
                  message: 'حداقل طول نام و نام خانوادگی 6 کاراکتر است'
                },
                pattern: {
                  value: /^[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی ]+$/,
                  message: 'لطفا نام و نام خانوادگی را به فارسی وارد نمایید'
                }
              })}
            />
            <FormErrorMessage>
              {errors.nameFamily && errors.nameFamily.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.homePhone}>
            <FormLabel htmlFor="homePhone">شماره تماس</FormLabel>
            <Input
              _placeholder={{ color: '#457b9d' }}
              onChange={e => {
                setUserData(prev => ({
                  ...prev,
                  homePhone: e.target.value
                }))
              }}
              id="homePhone"
              placeholder=" شماره تماس "
              {...register('homePhone', {
                required: {
                  value: true,
                  message: 'لطفا شماره تماس را وارد نمایید!'
                },
                minLength: {
                  value: 7,
                  message: 'حداقل طول شماره تماس 7 کاراکتر است'
                },
                maxLength: {
                  value: 11,
                  message: 'حداکثر طول شماره تماس 11 کاراکتر است'
                },
                pattern: {
                  value: /[0-9]*/,
                  message: 'لطفا شماره تماس را به درستی وارد نمایید'
                }
              })}
            />
            <FormErrorMessage>
              {errors.homePhone && errors.homePhone.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.homeAddress}>
            <FormLabel htmlFor="homeAddress  "> آدرس </FormLabel>
            <Textarea
              resize={true}
              rows={5}
              _placeholder={{ color: '#457b9d' }}
              onChange={e => {
                setUserData(prev => ({
                  ...prev,
                  homeAddress: e.target.value
                }))
              }}
              id="homeAddress"
              placeholder="آدرس"
              {...register('homeAddress', {
                required: {
                  value: true,
                  message: 'لطفا آدرس را وارد نمایید!'
                }
              })}
            />
            <FormErrorMessage>
              {errors.homeAddress && errors.homeAddress.message}
            </FormErrorMessage>
          </FormControl>

          <Stack spacing={3}>
            <FormLabel> استان </FormLabel>
            <Select
              focusBorderColor="#457b9d"
              color="#457b9d"
              value={provinceValue}
              id="province"
              size="lg"
              onChange={handleProvinceValue}
            >
              <option value="DEFAULT" disabled>
                لطفا استان را انتخاب نمایید ...
              </option>

              {provinces.map((item, index) => (
                <option key={index} value={item._id}>
                  {item.province}
                </option>
              ))}
            </Select>
            <FormLabel> شهرستان </FormLabel>
            <Select
              focusBorderColor="#457b9d"
              color="#457b9d"
              value={cityValue}
              id="city"
              size="lg"
              onChange={handleCityValue}
            >
              <option value="DEFAULT" disabled>
                لطفا شهرستان را انتخاب نمایید ...
              </option>

              {cities.map((item, index) => (
                <option key={index} value={item._id}>
                  {item.city}
                </option>
              ))}
            </Select>
            <Stack spacing={10} align="center" direction="row">
              <Stack align="center" direction="row">
                <FormLabel>متاهل؟</FormLabel>
                <Switch
                  id="married"
                  colorScheme="teal"
                  isChecked={userData.married}
                  onChange={() =>
                    setUserData(prev => ({
                      ...prev,
                      married: !userData.married
                    }))
                  }
                  size="lg"
                />
              </Stack>
              <Stack align="center" direction="row">
                <FormLabel htmlFor="email-alerts" mb="0">
                  آقا؟
                </FormLabel>
                <Switch
                  colorScheme="teal"
                  isChecked={userData.male}
                  id="male"
                  size="lg"
                  onChange={() =>
                    setUserData(prev => ({
                      ...prev,
                      male: !userData.male
                    }))
                  }
                />
              </Stack>
            </Stack>
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
              ثبت اطلاعات شخصی
            </Button>
          </Stack>
        </form>
      </Box>
    </Flex>
  )
}
