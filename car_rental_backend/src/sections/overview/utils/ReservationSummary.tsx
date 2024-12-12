import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

interface ReservationData {
  total: number;
  categories: string[];
  series: number[];
}

const ReservationSummary = () => {
  const [reservationData, setReservationData] = useState<ReservationData>({
    total: 0,
    categories: [],
    series: [],
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/dashboard/upcoming_reservations')
      .then((response) => response.json())
      .then((data) => {
        setReservationData(data);
      })
      .catch((error) => {
        console.error('There was an error fetching the reservations!', error);
      });
  }, []);

  return (
      <AnalyticsWidgetSummary
        title="Réservations à Venir"
        percent={2.8}
        total={reservationData.total}  
        color="warning"
        icon={<img alt="icon" src="/assets/icons/glass/ic-glass-buy.svg" />}
        chart={{
          categories: reservationData.categories,
          series: reservationData.series,
        }}
      />
  );
};

export default ReservationSummary;
