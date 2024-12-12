import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

const PlanningDeMaintenance = () => {
    const [maintenanceData, setMaintenanceData] = useState<any>({ categories: [], series: [], total: 0 });

    useEffect(() => {
        fetch('http://localhost:8000/api/dashboard/upcoming_maintenances')
            .then(response => response.json())
            .then(data => {
                setMaintenanceData(data);
            })
            .catch(error => {
                console.error('Error fetching maintenance data:', error);
            });
    }, []);

    return (
            <AnalyticsWidgetSummary
                title="Planning de Maintenance"
                percent={3.6}
                total={maintenanceData.total}
                color="error"
                icon={<img alt="icon" src="/assets/icons/glass/ic-glass-message.svg" />}
                chart={{
                    categories: maintenanceData.categories,
                    series: maintenanceData.series,
                }}
            />
    );
};

export default PlanningDeMaintenance;
