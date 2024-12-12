import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CarView } from 'src/sections/car/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Car - ${CONFIG.appName}`}</title>
      </Helmet>

      <CarView />
    </>
  );
}
