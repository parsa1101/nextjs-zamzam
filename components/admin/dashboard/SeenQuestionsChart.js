import {
  HStack,
  VStack,
  Text,
  Stack,
  useColorModeValue,
  Flex,
  Icon,
  useToast,
  Box,
  Heading,
  Select
} from '@chakra-ui/react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FaChevronUp } from 'react-icons/fa'
import { getError } from '../../../utils/error'
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
const SeenQuestionsChart = () => {
  const token = Cookies.get('userToken')

  const userId = Cookies.get('userId')

  const bgColor = useColorModeValue('gray.50', 'whiteAlpha.50')

  const [sumSeen, SetSumSeen] = useState(0)

  const [year, setYear] = useState('1400')

  const router = useRouter()

  const toast = useToast()

  const [datas, setData] = useState({
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
        borderColor: '#03045e',
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
  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    if (userId === undefined) {
      return router.push('/login')
    }

    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/admin/question/chart/${year}`, {
          headers: { authorization: `Bearer ${token}` }
        })

        const datasets = [...datas.datasets]

        const data2 = []

        data.chartInfo.map(info => data2.push(info.count))

        datasets[0].data = data2

        setData(prev => ({ ...prev, datasets: datasets }))

        SetSumSeen(data.sumCount)
      } catch (err) {
        toast({
          title: getError(err),
          status: 'error',
          isClosable: true
        })
      }
    }
    fetchData()
  }, [year])

  function changeYearHandler(value) {
    setYear(value)
  }

  return (
    <VStack p={10} align="flex-start" bg={bgColor}>
      <VStack alignItems="flex-start">
        <Box
          width="100%"
          bgGradient="linear(to-t, #03045e, #caf0f8)"
          rounded="lg"
          p={5}
        >
          <Stack direction="row" alignItems="top" marginBottom="1.5rem">
            <Stack>
              <Heading size="sm">تعداد بازدید از سایت :</Heading>
              {/* <Heading size="xs" color="gray.500">
                  nhjhgj
                </Heading> */}
            </Stack>
            <Stack direction={['column', 'row']} style={{ marginLeft: 'auto' }}>
              <Select
                variant="outline"
                onChange={e => changeYearHandler(e.target.value)}
                size="sm"
                value={year}
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
                {sumSeen}
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
          <Line data={datas} options={options} />
        </Stack>
      </HStack>
    </VStack>
  )
}

export default SeenQuestionsChart
