# Square invoice payment synchronization

Production notification URL: `https://www.foundationsandhorizons.com/api/square/webhook`.

In the existing Square developer application, create a production webhook subscription for `invoice.payment_made`. Configure its exact notification URL above. Put its signature key in the website's encrypted production environment as `SQUARE_WEBHOOK_SIGNATURE_KEY`. Also configure `SQUARE_WEBHOOK_NOTIFICATION_URL`, the account's `SQUARE_MERCHANT_ID`, and the private `SQUARE_CRM_OWNER_ID`. Redeploy after changing environment variables. No Square payment-creation token is needed for this receiving-only integration.

The receiver validates Square's HMAC signature against the exact URL and raw body, checks the merchant, requires a fully paid USD invoice, matches its exact `square:INVOICE_NUMBER` CRM import key and amount, and checks the recipient email when available. Retries use Square's event ID and cannot count revenue twice. The existing CRM invoice changes to paid; no second income receipt is inserted. The endpoint remains unavailable until all configuration is present.

Unmatched invoices return an error for review/retry; they are never attached to an arbitrary client. Partial payments, standalone checkout payments, refunds, disputes, and fees require separate reconciliation; this subscription only confirms full payment of already tracked invoices. Square email notifications remain a fallback through Reply Watch. Do not claim direct synchronization is active until a signed production test succeeds.

Other income is logged separately in `crm_other_income` using a unique provider payout/receipt reference. Never log a CRM invoice payment again as other income. Goals live in owner-protected `crm_goals`; each year's score uses payment received dates, not invoice issue dates. Take-home is a user aim, not an estimated tax result.
