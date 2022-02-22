/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react'
import {
  Flex,
  Heading,
  Avatar,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Divider,
  useToast,
  IconButton
} from '@chakra-ui/react'

import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import axios from 'axios'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import moment from 'jalali-moment'

export default function UsersDashboard() {
  const toast = useToast()

  const token = Cookies.get('userToken')

  const userId = Cookies.get('userId')

  const router = useRouter()

  const [display, changeDisplay] = useState('hide')

  const [tr1, setTr1] = useState([])

  const [tr2, setTr2] = useState([])

  useEffect(() => {
    if (userId === undefined) {
      return router.push('/login')
    }

    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/admin/users`, {
          headers: { authorization: `Bearer ${token}` }
        })
        setTr1([])
        setTr2([])
        if (data.length <= 5) {
          for (let index = 0; index < data.length; index++) {
            setTr1(prev => [
              ...prev,
              {
                nameFamily: data[index].nameFamily,
                mobile: data[index].mobile,
                email: data[index].email,
                createdAt: data[index].createdAt
              }
            ])
          }
        } else if (data.length > 5 && data.length <= 10) {
          for (let index = 0; index < 5; index++) {
            setTr1(prev => [
              ...prev,
              {
                nameFamily: data[index].nameFamily,
                mobile: data[index].mobile,
                email: data[index].email,
                createdAt: data[index].createdAt
              }
            ])
          }

          for (let i = 5; i < data.length; i++) {
            setTr2(prev => [
              ...prev,
              {
                nameFamily: data[i].nameFamily,
                mobile: data[i].mobile,
                email: data[i].email,
                createdAt: data[i].createdAt
              }
            ])
          }
        } else {
          for (let index = 0; index < 5; index++) {
            setTr1(prev => [
              ...prev,
              {
                nameFamily: data[index].nameFamily,
                mobile: data[index].mobile,
                email: data[index].email,
                createdAt: data[index].createdAt
              }
            ])
          }

          for (let i = 5; i < 10; i++) {
            setTr2(prev => [
              ...prev,
              {
                nameFamily: data[i].nameFamily,
                mobile: data[i].mobile,
                email: data[i].email,
                createdAt: data[i].createdAt
              }
            ])
          }
        }
      } catch (err) {
        toast({
          title: err.message,
          status: 'error',
          isClosable: true
        })
      }
    }
    fetchData()
  }, [])

  return (
    <Flex flexDir="column">
      <Heading as="h2" size="xl">
        نمایش کاربران جدید:
      </Heading>
      <Flex overflow="auto">
        <Table variant="unstyled" mt={4}>
          <Thead>
            <Tr color="gray">
              <Th>نام و نام خانوادگی</Th>
              <Th isNumeric>شماره تماس</Th>
              <Th>ایمیل</Th>
              <Th>تاریخ ثبت نام</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tr1.length > 0 &&
              tr1.map((item, index) => (
                <Tr key={index}>
                  <Td>
                    <Flex align="center">
                      <Avatar size="sm" mr={2} />
                      <Flex flexDir="column">
                        <Heading size="sm" letterSpacing="tight">
                          {item.nameFamily}
                        </Heading>
                      </Flex>
                    </Flex>
                  </Td>
                  <Td isNumeric>{item.mobile}</Td>
                  <Td>{item.email}</Td>
                  <Td>
                    <Text fontWeight="bold" display="inline-table">
                      {item.createdAt &&
                        moment(item.createdAt, 'YYYY-M-D HH:mm:ss')
                          .locale('fa')
                          .format('YYYY-M-D HH:mm:ss')}
                    </Text>
                  </Td>
                </Tr>
              ))}
            {display === 'show' &&
              tr2.length > 0 &&
              tr2.map((item, index) => (
                <Tr key={index}>
                  <Td>
                    <Flex align="center">
                      <Avatar size="sm" mr={2} />
                      <Flex flexDir="column">
                        <Heading size="sm" letterSpacing="tight">
                          {item.nameFamily}
                        </Heading>
                      </Flex>
                    </Flex>
                  </Td>
                  <Td isNumeric>{item.mobile}</Td>
                  <Td>{item.email}</Td>
                  <Td>
                    <Text fontWeight="bold" display="inline-table">
                      {moment(item.createdAt, 'YYYY-M-D HH:mm:ss')
                        .locale('fa')
                        .format('YYYY-M-D HH:mm:ss')}
                    </Text>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Flex>
      <Flex align="center">
        <Divider />
        <IconButton
          icon={display == 'show' ? <FiChevronUp /> : <FiChevronDown />}
          onClick={() => {
            if (display == 'show') {
              changeDisplay('none')
            } else {
              changeDisplay('show')
            }
          }}
        />
        <Divider />
      </Flex>
    </Flex>
  )
}
