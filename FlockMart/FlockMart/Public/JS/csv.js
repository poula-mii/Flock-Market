$(document).ready(function() {

    function getDaily() {
        let xlabel = [];
        let yprofit = [];
        let daily_csv = "Day,Earnings 01-05-2021,100 02-05-2021,102 03-05-2021,1000 4-05-2021,763 05-05-2021,109 06-05-2021,82 07-05-2021,2700 08-05-2021,3200 09-05-2021,3100 10-05-2021,4016.6 11-05-2021,4690.2 12-05-2021,5363.8 13-05-2021,6037.4 14-05-2021,6711 15-05-2021,1000 16-05-2021,763 17-05-2021,109 18-05-2021,1148 19-05-2021,4040 20-05-2021,268 21-05-2021,4652 22-05-2021,3494 23-05-2021,4422 24-05-2021,3966 25-05-2021,3599 26-05-2021,3581 27-05-2021,4146 28-05-2021,1566 29-05-2021,1785 30-05-2021,4512 31-05-2021,1263";

        const table = daily_csv.split(" ").slice(1);
        table.forEach(row => {
            const columns = row.split(",");
            const day = columns[0];
            xlabel.push(day);
            const profit = columns[1];
            yprofit.push(profit);
        })

        chartIt(xlabel, yprofit, "daily", "Daily Profits", "#F5B041", "line");

    }

    function getMonthly() {
        let xlabel = [];
        let yprofit = [];
        let monthly_csv = "Month,Earnings Jan-21,72100 Feb-21,50238 Mar-21,54048 Apr-21,57708 May-21,75217 Jun-21,98073 Jul-21,74332 Aug-21,72730 Sep-21,94759 Oct-21,93787 Nov-21,79087 Dec-21,60419";

        const table = monthly_csv.split(" ").slice(1);
        table.forEach(row => {
            const columns = row.split(",");
            const day = columns[0];
            xlabel.push(day);
            const profit = columns[1];
            yprofit.push(profit);
        })

        chartIt(xlabel, yprofit, "monthly", "Monthly Profits", "rgb(50, 190, 143)", "bar");

    }

    function getYearly() {
        let xlabel = [];
        let yprofit = [];
        let yearly_csv = "Year,Earnings 2021,4248997 2022,3219551 2023,4974494 2024,4339670 2025,2681122 2026,1982033 2027,4573028 2028,1712764";

        const table = yearly_csv.split(" ").slice(1);
        table.forEach(row => {
            const columns = row.split(",");
            const day = columns[0];
            xlabel.push(day);
            const profit = columns[1];
            yprofit.push(profit);
        })

        chartIt(xlabel, yprofit, "yearly", "Yearly Profits", "rgb(92, 138, 255)", "line");

    }

    function chartIt(xlabel, yprofit, id, head, color, chartType) {
        let ctx = document.getElementById(`${id}`).getContext('2d');
        let myChart = new Chart(ctx, {
            type: chartType,
            data: {
                labels: xlabel,
                datasets: [{
                    label: head,
                    data: yprofit,
                    backgroundColor: [`${color}`],
                    borderColor: [`${color}`],
                    borderWidth: 1
                }]
            },
            options: {
                responive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    getDaily();
    getMonthly();
    getYearly();
})