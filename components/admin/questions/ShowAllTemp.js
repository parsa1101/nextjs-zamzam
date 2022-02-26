import React from 'react'
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  Heading
} from '@chakra-ui/react'

import { useRouter } from 'next/router'

import { ArrowForwardIcon } from '@chakra-ui/icons'

export default function ShowAllTemp({ question, answers }) {
  const router = useRouter()

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white">
      <Box
        borderWidth="1px"
        m={5}
        borderRadius="lg"
        borderColor="gray"
        overflow="hidden"
        bg="white"
      >
        <Flex flexDir="column">
          <Heading as="h2" size="sm" mt={5}>
            {question.text}
          </Heading>
          <Flex overflow="auto">
            <Table variant="simple" mt={5}>
              <Thead>
                <Tr>
                  <Th>شماره</Th>
                  <Th>متن جواب</Th>

                  <Th>نمایش جواب</Th>
                </Tr>
              </Thead>
              <Tbody>
                {answers.map((item, i) => (
                  <Tr key={i}>
                    <Td>{i}</Td>

                    <Td>{item.text}</Td>
                    <Td>
                      <Button
                        rightIcon={<ArrowForwardIcon />}
                        colorScheme="teal"
                        variant="outline"
                        onClick={() =>
                          router.push(
                            `/admin/questions/temp/answer/${item._id}`
                          )
                        }
                      >
                        نمایش جواب
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Flex>
        </Flex>
      </Box>
    </Box>
  )
}
