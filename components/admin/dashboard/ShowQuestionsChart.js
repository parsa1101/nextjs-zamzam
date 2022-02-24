import {
  HStack,
  VStack,
  Text,
  Stack,
  useColorModeValue,
  Flex,
  Icon,
  Box,
  Heading,
  Select
} from '@chakra-ui/react'
import axios from 'axios'

import { useState } from 'react'
import { FaChevronUp } from 'react-icons/fa'
import { Line } from 'react-chartjs-2'
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
} from 'chart.js'
import useSWR from 'swr'

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
)

const options = {
  maintainAspectRatio: true,
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      grid: {
        borderDash: [3, 3]
      }
      // beginAtZero: true, // this works
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
}
const ShowQuestionsChart = ({ token }) => {
  const bgColor = useColorModeValue('gray.50', 'whiteAlpha.50')

  const [countQuestion, SetcountQuestion] = useState(0)

  const [yearQuestion, setyearQuestion] = useState('1400')

  // const toast = useToast()

  const [datas2, setData2] = useState({
    labels: [
      'فروردین',
      'اردیبهشت',
      'خرداد',
      'تیر',
      'مرداد',
      'شهریور',
      'مهر',
      'آبان',
      'آذر',
      'دی',
      'بهمن',
      'اسفند'
    ],
    datasets: [
      {
        label: 'My Balance',
        fill: false,
        lineTension: 0.5,
        backgroundColor: '#db86b2',
        borderColor: '#fec5bb',
        borderCapStyle: 'butt',
        borderDashOffset: 0.0,
        borderJoinStyle: '#B57295',
        pointBorderColor: '#B57295',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#B57295',
        pointHoverBorderColor: '#B57295',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: []
      }
    ]
  })

  const fetcher2 = async (url, token) => {
    await axios
      .get(url, { headers: { Authorization: 'Bearer ' + token } })
      .then(res => {
        const datasets = [...datas2.datasets]

        const data2 = []

        res.data.chartInfo.map(info => data2.push(info.count))

        datasets[0].data = data2

        setData2(prev => ({ ...prev, datasets: datasets }))

        SetcountQuestion(res.data.sumCount)
      })
    // .catch(function (error) {
    //   if (error.response) {
    //     console.log(error.response.data)
    //     console.log(error.response.status)
    //     console.log(error.response.headers)
    //   } else if (error.request) {
    //     console.log(error.request)
    //   } else {
    //     // Something happened in setting up the request that triggered an Error
    //     console.log('Error', error.message)
    //   }
    //   console.log(error.config)
    // })
  }
  useSWR(
    [`/api/admin/question/chart/countQuestions/${yearQuestion}`, token],
    fetcher2,
    {
      // onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      //   if (error) {
      //     toast({
      //       title: 'خطا',
      //       description: 'متاسفانه در بازیابی اطلاعات مشکلی به وجود آمده است.',
      //       status: 'error',
      //       duration: 9000
      //     })
      //   }
      //   if (retryCount >= 10) return
      //   // Retry after 5 seconds.
      //   setTimeout(() => revalidate({ retryCount }), 5000)
      // }
    }
  )

  function changeYearHandler(value) {
    setyearQuestion(value)
  }

  return (
    <VStack p={10} spacing={6} align="flex-start" bg={bgColor}>
      <VStack alignItems="flex-start">
        <Box
          width="100%"
          bgGradient="linear(to-t, #fec89a, #fec5bb)"
          rounded="lg"
          p={5}
        >
          <Stack direction="row" alignItems="top" marginBottom="1.5rem">
            <Stack>
              <Heading size="sm">مجموع سوالات سایت :</Heading>
              {/* <Heading size="xs" color="gray.500">
                  nhjhgj
                </Heading> */}
            </Stack>
            <Stack direction={['column', 'row']} style={{ marginLeft: 'auto' }}>
              <Select
                variant="outline"
                onChange={e => changeYearHandler(e.target.value)}
                size="sm"
                value={yearQuestion}
              >
                <option value="1400">1400</option>
                <option value="1401">1401</option>
                <option value="1402">1402</option>
              </Select>
            </Stack>
          </Stack>
          <Box>
            {' '}
            <Flex alignItems="center" justifyContent="space-between">
              <Text fontSize="2em" lineHeight="4rem" fontWeight="500">
                {countQuestion}
              </Text>
              <Stack alignItems="center">
                <Icon as={FaChevronUp} color="gray.100" fontSize="2em" />
              </Stack>
            </Flex>
          </Box>
        </Box>
      </VStack>
      <HStack alignItems="center" height={'100%'}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Line data={datas2} options={options} />
        </Stack>
      </HStack>
    </VStack>
  )
}

export default ShowQuestionsChart
