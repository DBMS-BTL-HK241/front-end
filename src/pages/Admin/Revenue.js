import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const RevenueChart = () => {
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRevenue = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token is missing. Please log in.");
            setError("Authentication error. Please log in.");
            setIsLoading(false);
            return;
        }

        try {
            console.log("Fetching data from API...");
            const response = await axios.get(
                "http://localhost:3001/revenue/last_month", // API endpoint
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("API Response:", response);

            const data = response.data.data;
            console.log("Response Data:", data);

            // Aggregate revenue by date
            const revenueByDate = data.reduce((acc, { date, amount }) => {
                const formattedDate = new Date(date).toISOString().split("T")[0]; // YYYY-MM-DD
                acc[formattedDate] = (acc[formattedDate] || 0) + amount;
                return acc;
            }, {});

            const labels = Object.keys(revenueByDate).sort();
            const revenue = labels.map(date => revenueByDate[date]);

            // Calculate average revenue
            const totalDays = revenue.length;
            const averageRevenue = totalDays > 0 ? revenue.map(() => revenue.reduce((sum, val) => sum + val, 0) / totalDays) : [];

            setChartData({
                labels,
                datasets: [
                    {
                        label: "Daily Revenue",
                        data: revenue,
                        backgroundColor: "rgba(75, 192, 192, 0.6)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                    },
                    {
                        label: "Average Revenue",
                        data: averageRevenue,
                        backgroundColor: "rgba(153, 102, 255, 0.6)",
                        borderColor: "rgba(153, 102, 255, 1)",
                        borderWidth: 2,
                        fill: false,
                        borderDash: [5, 5], // Dashed line for average
                        tension: 0.4,
                    },
                ],
            });
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching revenue data:", error);
            setError("Failed to fetch revenue data. Please try again later.");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRevenue();
    }, []);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4 text-center">Revenue Chart</h1>
            <Line
                data={chartData}
                options={{
                    responsive: true,
                    plugins: {
                        legend: { position: "top" },
                        title: { display: true, text: "Revenue of the Last Month" },
                    },
                }}
            />
        </div>
    );
};

export default RevenueChart;
