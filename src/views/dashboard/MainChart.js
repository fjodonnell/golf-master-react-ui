import React, { useEffect, useRef, useState } from 'react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'

const MainChart = ({ metric }) => {
  const chartRef = useRef(null)
  const [chartData, setChartData] = useState({
    labels: ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7'],
    datasets: [],
  })

  // Detect mobile for dynamic styling
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const yAxisLimits = {
    scores: { min: 70, max: 86 },
    pars: { min: 0, max: 16 },
    birdies: { min: 0, max: 8 },
  }

  const playersConfig = [
    { id: 'fjodonnell', label: 'FJ', color: 'success' },
    { id: 'zhuston', label: 'Zach', color: 'info' },
    { id: 'acarpenter', label: 'Carp', color: 'warning' },
    { id: 'wghidotti', label: 'Bill', color: 'danger' },
  ]

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch(
          'https://golf-master-backend.onrender.com/score/eventName/Tournament%20du%20Sol%202025'
        )
        const scores = await response.json()

        const groupedPlayers = playersConfig.reduce((acc, player) => {
          acc[player.id] = []
          return acc
        }, {})

        scores.forEach((score) => {
          const playerId = score.player.playerId
          if (groupedPlayers[playerId]) {
            let value
            switch (metric) {
              case 'pars':
                value = score.pars ?? 0
                break
              case 'birdies':
                value = score.birdies ?? 0
                break
              default:
                value = score.score ?? 0
            }
            groupedPlayers[playerId].push({ roundNumber: score.round.roundNumber, value })
          }
        })

        const datasets = playersConfig.map((player) => ({
          label: player.label,
          backgroundColor: `rgba(${getStyle(`--cui-${player.color}-rgb`)}, .1)`,
          borderColor: getStyle(`--cui-${player.color}`),
          pointHoverBackgroundColor: getStyle(`--cui-${player.color}`),
          borderWidth: isMobile ? 2 : 3, // Slightly thinner lines on mobile
          data: groupedPlayers[player.id].map((entry) => entry.value),
        }))

        setChartData({
          labels: ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7'],
          datasets,
        })
      } catch (error) {
        console.error('Error fetching scores:', error)
      }
    }

    fetchScores()
  }, [metric, isMobile])

  useEffect(() => {
    const updateColors = () => {
      if (chartRef.current) {
        const { options } = chartRef.current
        const borderColor = getStyle('--cui-border-color-translucent')
        const bodyColor = getStyle('--cui-body-color')

        options.scales.x.grid.borderColor = borderColor
        options.scales.x.grid.color = borderColor
        options.scales.x.ticks.color = bodyColor
        options.scales.y.grid.borderColor = borderColor
        options.scales.y.grid.color = borderColor
        options.scales.y.ticks.color = bodyColor
        chartRef.current.update()
      }
    }

    document.documentElement.addEventListener('ColorSchemeChange', updateColors)
    return () => {
      document.documentElement.removeEventListener('ColorSchemeChange', updateColors)
    }
  }, [])

  const yLimits = yAxisLimits[metric] || yAxisLimits.scores

  return (
    <CChartLine
      ref={chartRef}
      style={{ height: isMobile ? '300px' : '400px', marginTop: isMobile ? '20px' : '40px' }}
      data={chartData}
      options={{
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: getStyle('--cui-body-color'),
              font: {
                size: isMobile ? 11 : 14,
              },
              usePointStyle: true,
              pointStyle: 'circle',
              padding: isMobile ? 15 : 25,
            },
          },
          tooltip: {
            enabled: true,
            padding: 10,
            cornerRadius: 4,
          }
        },
        scales: {
          x: {
            grid: { 
              color: getStyle('--cui-border-color-translucent'), 
              drawOnChartArea: false 
            },
            ticks: { 
              color: getStyle('--cui-body-color'),
              font: { size: isMobile ? 10 : 12 }
            },
          },
          y: {
            min: yLimits.min,
            max: yLimits.max,
            grid: {
              color: getStyle('--cui-border-color-translucent'),
            },
            ticks: {
              color: getStyle('--cui-body-color'),
              font: { size: isMobile ? 10 : 12 },
              stepSize:
                metric === 'pars'
                  ? 4
                  : metric === 'birdies'
                    ? 2
                    : undefined,
              callback: function (value) {
                if (metric === 'pars') return [4, 8, 12, 16].includes(value) ? value : ''
                if (metric === 'birdies') return [2, 4, 6, 8].includes(value) ? value : ''
                return value
              },
            },
          },
        },
        elements: {
          line: { tension: 0.4 },
          point: { 
            radius: isMobile ? 3 : 2, 
            hitRadius: 20, // Huge hit radius for thumb-tapping accuracy
            hoverRadius: 6, 
            hoverBorderWidth: 2 
          },
        },
      }}
    />
  )
}

export default MainChart