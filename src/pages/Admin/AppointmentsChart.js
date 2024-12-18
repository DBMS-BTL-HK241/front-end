import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { fetchAppointmentsChart } from '../../services/apiService';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AppointmentsChart = () => {
    const [data, setData] = useState([]);
    const [filterYear, setFilterYear] = useState("");
    const [chartData, setChartData] = useState(null);

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchAppointmentsChart();
                setData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    // Filter data by year and prepare chart data
    useEffect(() => {
        const filteredData = filterYear
            ? data.filter((item) => item.year === parseInt(filterYear))
            : data;

        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        // Create arrays for the completed and cancelled appointments for each month
        const completedAppointments = months.map((_, index) => {
            const monthData = filteredData.find((item) => item.month === index + 1);
            return monthData ? monthData.totalCompleted : 0;
        });

        const cancelledAppointments = months.map((_, index) => {
            const monthData = filteredData.find((item) => item.month === index + 1);
            return monthData ? monthData.totalCancelled : 0;
        });

        const chartDataset = {
            labels: months,
            datasets: [
                {
                    label: "Completed Appointments",
                    data: completedAppointments,
                    backgroundColor: "rgba(75, 192, 192, 0.5)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
                {
                    label: "Cancelled Appointments",
                    data: cancelledAppointments,
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 1,
                },
            ],
        };

        setChartData(chartDataset);
    }, [data, filterYear]);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4 text-center">Appointments Chart</h1>
            <label>
                Filter by Year:{" "}
                <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
                    {[...new Set(data.map((item) => item.year))].map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </label>
            {chartData ? (
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                display: true,
                                position: "top",
                            },
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                            },
                        },
                    }}
                />
            ) : (
                <p>Loading chart...</p>
            )}
        </div>
    );
};

export default AppointmentsChart;
