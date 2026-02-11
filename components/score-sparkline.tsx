"use client"

import { LineChart, Line, ResponsiveContainer } from "recharts"

export function ScoreSparkline({ data }: { data: number[] }) {
  const chartData = data.map((v, i) => ({ v, i }))
  return (
    <div className="h-10 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="v"
            stroke="hsl(239, 84%, 67%)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
