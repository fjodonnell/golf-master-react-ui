import React, { useEffect, useRef, useState } from 'react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'

const MainChart = ({ metric }) => {
  const chartRef = useRef(null)
  const [chartData, setChartData] = useState({
    labels: ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7'],
    datasets: [],
  })

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
          'http://localhost:8080/score/eventName/Tournament%20du%20Sol%202025'
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
          borderWidth: 2,
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
  }, [metric])

  useEffect(() => {
    const updateColors = () => {
      if (chartRef.current) {
        const { options } = chartRef.current
        options.scales.x.grid.borderColor = getStyle('--cui-border-color-translucent')
        options.scales.x.grid.color = getStyle('--cui-border-color-translucent')
        options.scales.x.ticks.color = getStyle('--cui-body-color')
        options.scales.y.grid.borderColor = getStyle('--cui-border-color-translucent')
        options.scales.y.grid.color = getStyle('--cui-border-color-translucent')
        options.scales.y.ticks.color = getStyle('--cui-body-color')
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
      style={{ height: '400px', marginTop: '40px' }}
      data={chartData}
      options={{
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: '#ffffff', // white text
              font: {
                size: 14, // bigger font
              },
              usePointStyle: true, // use line or circle instead of box
              pointStyle: 'line',  // set to 'line' for a line legend
              padding: 25,
            },
          }
        },
        scales: {
          x: {
            grid: { color: getStyle('--cui-border-color-translucent'), drawOnChartArea: false },
            ticks: { color: getStyle('--cui-body-color') },
          },
          y: {
            min: yLimits.min,
            max: yLimits.max,
            grid: {
              color: getStyle('--cui-border-color-translucent'),
            },
            ticks: {
              color: getStyle('--cui-body-color'),
              stepSize:
                metric === 'pars'
                  ? 4
                  : metric === 'birdies'
                    ? 2
                    : undefined, // fallback for scores
              callback: function (value) {
                if (metric === 'pars') {
                  return [4, 8, 12, 16].includes(value) ? value : ''
                }
                if (metric === 'birdies') {
                  return [2, 4, 6, 8].includes(value) ? value : ''
                }
                return value
              },
            },
          },
        },
        elements: {
          line: { tension: 0.4 },
          point: { radius: 2, hitRadius: 6, hoverRadius: 4, hoverBorderWidth: 2 },
        },
      }}
    />
  )
}

export default MainChart
