const ZEPTOMAIL_ENDPOINT = "https://api.zeptomail.com/v1.1/email";
const FROM_ADDRESS = "contato@menuoglobal.com";
const FROM_NAME = "MENUO";

export function hasEmailProvider(): boolean {
  return Boolean(process.env.ZEPTOMAIL_API_TOKEN);
}

/** Sends one transactional email via ZeptoMail. Throws if the provider
 * isn't configured or the API rejects the request — callers decide whether
 * that should surface to the user or just get logged (see
 * forgot-password's route, which never lets this affect the response so it
 * can't be used to probe which emails have accounts). */
export async function sendEmail({
  to,
  toName,
  subject,
  html,
}: {
  to: string;
  toName?: string;
  subject: string;
  html: string;
}): Promise<void> {
  const apiToken = process.env.ZEPTOMAIL_API_TOKEN;
  if (!apiToken) {
    throw new Error("ZEPTOMAIL_API_TOKEN is not configured");
  }

  const res = await fetch(ZEPTOMAIL_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Zoho-enczapikey ${apiToken}`,
    },
    body: JSON.stringify({
      from: { address: FROM_ADDRESS, name: FROM_NAME },
      to: [{ email_address: { address: to, name: toName || to } }],
      subject,
      htmlbody: html,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`ZeptoMail request failed: ${res.status} ${body}`);
  }
}
