import React from 'react'
import { Box, Stack, Select, Heading } from '@chakra-ui/react'

export default function Card({ title, subtitle, onClick, children, year }) {
  return (
    <Box
      width="100%"
      bgGradient="linear(to-t, #B57295, #29259A)"
      rounded="lg"
      p={5}
    >
      <Stack direction="row" alignItems="top" marginBottom="1.5rem">
        <Stack>
          <Heading size="md">{title}</Heading>
          <Heading size="xs" color="gray.500">
            {subtitle}
          </Heading>
        </Stack>
        <Stack direction={['column', 'row']} style={{ marginLeft: 'auto' }}>
          <Select
            variant="outline"
            onChange={e => onClick(e.target.value)}
            size="sm"
            value={year}
          >
            <option value="1400">1400</option>
            <option value="1401">1401</option>
            <option value="1402">1402</option>
          </Select>
        </Stack>
      </Stack>
      <Box>{children}</Box>
    </Box>
  )
}
