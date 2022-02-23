import React, { useEffect, useState } from 'react'
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
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useToast } from '@chakra-ui/react'
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

const QuestionsChart = ({ year, sumCountQuestionFunc }) => {
  const token = Cookies.get('userToken')
  const userId = Cookies.get('userId')

  const router = useRouter()

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
        borderColor: '#B57295',
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

  const toast = useToast()

  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    if (userId === undefined) {
      return router.push('/login')
    }

    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/admin/question/chart/countQuestions/${year}`,
          {
            headers: { authorization: `Bearer ${token}` }
          }
        )

        const datasets = [...datas.datasets]

        const data2 = [...datasets[0].data]

        data.chartInfo.map(info => data2.push(info.count))

        datasets[0].data = data2

        setData(prev => ({ ...prev, datasets: datasets }))

        sumCountQuestionFunc(data.sumCount)
      } catch (err) {
        toast({
          title: err.message,
          status: 'error',
          isClosable: true
        })
      }
    }
    fetchData()
  }, [year])

  return <Line data={datas} options={options} />
}

export default QuestionsChart
