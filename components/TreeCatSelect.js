import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  CircularProgress,
  CloseButton,
  List,
  ListIcon,
  ListItem
} from '@chakra-ui/react'
import React from 'react'

import useSWR from 'swr'

import { MdCheckCircle } from 'react-icons/md'
import { useRouter } from 'next/router'

export default function TreeCatSelect({ catId }) {
  const fetcher = (...args) => fetch(...args).then(res => res.json())

  const { data, error } = useSWR(`/api/category/${catId}`, fetcher)

  const router = useRouter()

  if (error)
    return (
      <Alert
        status="success"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          خطا!
          <CloseButton position="absolute" right="8px" top="8px" />
        </AlertTitle>
        <AlertDescription maxWidth="sm">{error}</AlertDescription>
      </Alert>
    )
  if (!data)
    return (
      <div>
        <CircularProgress />
      </div>
    )

  return (
    <List spacing={3}>
      {data.map((item, index) => (
        <ListItem key={index}>
          <ListIcon as={MdCheckCircle} color="green.500" />
          <Button
            variant="ghost"
            onClick={() => router.push(`/question/category/${item._id}`)}
          >
            {item.name}
          </Button>
          {item.hasChild && <TreeCatSelect catId={item._id} />}
        </ListItem>
      ))}
    </List>
  )
}
