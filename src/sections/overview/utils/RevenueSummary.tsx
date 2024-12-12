import { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';

import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

interface RevenueData {
  total: number;
  categories: string[];
  series: number[];
}

const RevenueSummary = () => {
  const [revenueData, setRevenueData] = useState<RevenueData>({ total: 0,
    categories: [],
    series: [],});
    
  useEffect(() => {
    fetch('http://localhost:8000/api/dashboard/revenues')
      .then((response) => response.json())
      .then((data) => {
        setRevenueData(data);
      })
      .catch((error) => {
        console.error('There was an error fetching the revenues!', error);
      });
  }, []);


  return (
      <AnalyticsWidgetSummary
        title="Revenus par Période"
        percent={3.1}
        total={revenueData.total}  
        color="secondary"
        icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
        chart={{
          categories: revenueData.categories,
          series: revenueData.series,
        }}
      />
  );
};

export default RevenueSummary;
