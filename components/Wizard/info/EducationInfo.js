import React, { useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'

import Cookies from 'js-cookie'
import {} from '../../../utils/error'

import {
  Button,
  CircularProgress,
  FormLabel,
  Stack,
  Switch,
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

const evidences = [
  { name: 'زیردیپلم', value: '0' },
  { name: 'دیپلم', value: '1' },
  { name: 'فوق دیپلم', value: '2' },
  { name: 'کارشناسی', value: '3' },
  { name: 'کارشناسی ارشد', value: '4' },
  { name: 'دکتری', value: '5' }
]
export default function EducationInfo({
  userId,
  userEduInfo,
  eduProvinces,
  educationCities
}) {
  const [eduCities, setEduCities] = useState(educationCities)
  const [eduCityLoading, setEduCityLoding] = useState(false)

  const [userEduData, setUserEduData] = useState({
    major: userEduInfo ? userEduInfo.major : '',
    universityName: userEduInfo ? userEduInfo.universityName : '',
    provinceId: userEduInfo ? userEduInfo.provinceId : 'DEFAULT',
    cityId: userEduInfo ? userEduInfo.cityId : 'DEFAULT',
    evidence: userEduInfo ? userEduInfo.evidence : '',
    educationStatus: userEduInfo ? userEduInfo.educationStatus : true
  })

  const token = Cookies.get('userToken')

  const toast = useToast()

  const {
    handleSubmit,
    register,

    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      major: userEduInfo ? userEduInfo.major : '',
      universityName: userEduInfo ? userEduInfo.universityName : '',
      provinceId: userEduInfo ? userEduInfo.provinceId : '',
      cityId: userEduInfo ? userEduInfo.cityId : '',
      evidence: userEduInfo ? userEduInfo.evidence : '',
      educationStatus: userEduInfo ? userEduInfo.educationStatus : ''
    }
  })

  const onEduSubmit = async ({ major, universityName }) => {
    try {
      await axios.post(
        `/api/profile/educationInfo`,
        {
          userId,
          major,
          universityName,
          evidence: userEduData.evidence,
          educationStatus: userEduData.educationStatus,
          provinceId: userEduData.provinceId,
          cityId: userEduData.cityId
        },
        { headers: { authorization: `Bearer ${token}` } }
      )
      toast({
        title: 'کاربر گرامی ! اطلاعات تحصیلی شما با موفقیت ثبت گردید.',
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

  const handleEvidenceValue = e => {
    setUserEduData(prev => ({
      ...prev,
      evidence: e.target.value
    }))
  }

  const handleEduProvinceValue = async e => {
    setEduCityLoding(true)
    setUserEduData(prev => ({
      ...prev,
      provinceId: e.target.value
    }))
    try {
      const { data } = await axios.get(`/api/province/${e.target.value}`)
      setEduCities(data)
    } catch (err) {
      toast({
        title: err.message,
        status: 'error',
        isClosable: true
      })
    }
    setEduCityLoding(false)
  }

  const handleEduCityValue = e => {
    setUserEduData(prev => ({
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
        <form onSubmit={handleSubmit(onEduSubmit)}>
          <FormControl isInvalid={errors.major}>
            <FormLabel htmlFor="major  "> رشته تحصیلی </FormLabel>
            <Input
              _placeholder={{ color: '#457b9d' }}
              onChange={e => {
                setUserEduData(prev => ({
                  ...prev,
                  major: e.target.value
                }))
              }}
              id="major"
              placeholder="رشته تحصیلی"
              {...register('major', {
                required: {
                  value: true,
                  message: 'لطفا رشته تحصیلی را وارد نمایید!'
                },
                minLength: {
                  value: 4,
                  message: 'حداقل طول رشته تحصیلی 4 کاراکتر است'
                },
                pattern: {
                  value: /^[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی ]+$/,
                  message: 'لطفا رشته تحصیلی را به فارسی وارد نمایید'
                }
              })}
            />
            <FormErrorMessage>
              {errors.major && errors.major.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.universityName}>
            <FormLabel htmlFor="universityName">
              نام دانشگاه محل تحصیل
            </FormLabel>
            <Input
              _placeholder={{ color: '#457b9d' }}
              onChange={e => {
                setUserEduData(prev => ({
                  ...prev,
                  universityName: e.target.value
                }))
              }}
              id="universityName"
              placeholder=" نام دانشگاه"
              {...register('universityName', {
                required: {
                  value: true,
                  message: 'لطفا نام دانشگاه را وارد نمایید!'
                },
                minLength: {
                  value: 3,
                  message: 'حداقل طول نام دانشگاه 3 کاراکتر است'
                },
                pattern: {
                  value: /^[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی ]+$/,
                  message: 'لطفا نام دانشگاه را به فارسی وارد نمایید'
                }
              })}
            />
            <FormErrorMessage>
              {errors.universityName && errors.universityName.message}
            </FormErrorMessage>
          </FormControl>

          <Stack spacing={3}>
            <FormLabel> آخرین مدرک تحصیلی </FormLabel>
            <Select
              focusBorderColor="#457b9d"
              color="#457b9d"
              value={userEduData.evidence}
              id="evidence"
              size="lg"
              onChange={handleEvidenceValue}
              name="evidence"
            >
              <option value="DEFAULT" disabled>
                لطفا اخرین مدرک تحصیلی را انتخاب نمایید ...
              </option>

              {evidences.map((item, index) => (
                <option key={index} value={item.value}>
                  {item.name}
                </option>
              ))}
            </Select>
            <FormLabel>استان محل تحصیل </FormLabel>
            <Select
              focusBorderColor="#457b9d"
              color="#457b9d"
              value={userEduData.provinceId}
              id="province"
              size="lg"
              onChange={handleEduProvinceValue}
            >
              <option value="DEFAULT" disabled>
                لطفا استان را انتخاب نمایید ...
              </option>

              {eduProvinces.map((item, index) => (
                <option key={index} value={item._id}>
                  {item.province}
                </option>
              ))}
            </Select>
            <FormLabel> شهرستان محل تحصیل </FormLabel>
            <Select
              focusBorderColor="#457b9d"
              color="#457b9d"
              value={userEduData.cityId}
              id="city"
              size="lg"
              onChange={handleEduCityValue}
              icon={
                eduCityLoading && (
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

              {eduCities.map((item, index) => (
                <option key={index} value={item._id}>
                  {item.city}
                </option>
              ))}
            </Select>
            <Stack spacing={10} align="center" direction="row">
              <Stack align="center" direction="row">
                <FormLabel>در حال تحصیل:</FormLabel>
                <Switch
                  id="educationStatus"
                  colorScheme="teal"
                  isChecked={userEduData.educationStatus}
                  onChange={() =>
                    setUserEduData(prev => ({
                      ...prev,
                      educationStatus: !userEduData.educationStatus
                    }))
                  }
                  size="lg"
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
              ثبت اطلاعات تحصیلی
            </Button>
          </Stack>
        </form>
      </Box>
    </Flex>
  )
}
