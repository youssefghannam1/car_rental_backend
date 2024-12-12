// Core imports
import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// Mock data and layout imports
import { _tasks } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

// Component imports
import { AnalyticsTasks } from '../analytics-tasks';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import RevenueSummary from '../utils/RevenueSummary';
import ReservationSummary from '../utils/ReservationSummary';
import PlanningDeMaintenance from '../utils/PlanningDeMaintenance';
import RevenueByCategory from '../utils/RevenueByCategory';
import RevenueAndLosses from '../utils/RevenueAndLosses';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Taux d'Utilisation de la Flotte"
            percent={2.6}
            total={67000}
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <RevenueSummary />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <ReservationSummary />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <PlanningDeMaintenance />
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <RevenueByCategory />
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
          <RevenueAndLosses />
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
          <AnalyticsTasks title="Tâches" list={_tasks} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}

export default OverviewAnalyticsView;
