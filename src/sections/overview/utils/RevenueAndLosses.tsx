import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';

const RevenueAndLosses = () => {
  const [chartData, setChartData] = useState({
    categories: [],
    series: [],
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/dashboard/revenues_and_losses')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setChartData(data);
      })
      .catch((error) => {
        console.error('Error fetching revenues and losses:', error);
      });
  }, []);

  return (
      <AnalyticsWebsiteVisits
        title="Pertes et Revenus"
        subheader="(+43%) than last year"
        chart={chartData}
      />
  );
};

export default RevenueAndLosses;
