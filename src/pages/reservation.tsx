import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ReservationView } from 'src/sections/reservation/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Réservation - ${CONFIG.appName}`}</title>
      </Helmet>

      <ReservationView />
    </>
  );
}
