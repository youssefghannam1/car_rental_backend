import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { InvoiceView } from 'src/sections/invoices/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Invoices - ${CONFIG.appName}`}</title>
      </Helmet>

      <InvoiceView />
    </>
  );
}
