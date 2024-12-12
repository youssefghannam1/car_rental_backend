import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';

const RevenueByCategory = () => {
  const [chartData, setChartData] = useState({ series: [] });

  useEffect(() => {
    fetch('http://localhost:8000/api/dashboard/revenue_by_category')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setChartData(data.chart);
      })
      .catch((error) => {
        console.error('Error fetching revenue by category:', error);
      });
  }, []);

  return (
      <AnalyticsCurrentVisits
        title="Revenus par Catégorie"
        chart={chartData}
      />
  );
};

export default RevenueByCategory;
