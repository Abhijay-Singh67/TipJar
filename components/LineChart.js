"use client"
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler } from 'chart.js';
import { useEffect, useState } from "react"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler);

export default function LineChart() {
    const [transactions, setTransactions] = useState([])
    useEffect(() => {
        (async () => {
            let req = await fetch("/api/transactions")
            let res = await req.json();
            setTransactions((Array.from(res.transaction)).slice(-10))
        })()
    }, [])
    const data = {
        labels: ['','','','','','','','','',''],
        datasets: [
            {
                label: "Hello",
                data: transactions,
                fill: false,
                pointBackgroundColor: "rgb(177, 149, 236)",
                backgroundColor: '#b095ec70',
                borderColor: '#5522c3',
                fill: true,
                tension: 0,
                pointRadius: 5,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: false },
        },
        scales: {
            x: {
                grid: { display: true },
                ticks: { display: true },
            },
            y: {
                grid: { display: true },
                ticks: { display: true },
            },
        },
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl p-1">
            <Line data={data} options={options} />
        </div>
    );
}
