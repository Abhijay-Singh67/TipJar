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
            let temp = (Array.from(res.transaction)).slice(-10)
            let trans = []
            temp.forEach((value) => {
                trans.push(value.amount);
            })
            setTransactions(trans);
        })()
    }, [])
    const data = {
        labels: ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'],
        datasets: [
            {
                label: "",
                data: transactions.map((i) => i / 10),
                fill: false,
                pointBackgroundColor: "#9f7ee6",
                backgroundColor: '#b095ec70',
                borderColor: '#5522c3',
                pointBorderColor: 'rgba(85, 34, 195, 0.3)',
                pointBorderWidth: 15,
                pointHoverRadius: 8,
                fill: true,
                tension: 0.2,
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
                ticks: { display: true, color: "#000000" },
            },
            y: {
                grid: { display: false },
                ticks: { display: false },
            },
        },
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-transparent rounded-2xl p-1">
            <Line data={data} options={options} />
        </div>
    );
}
