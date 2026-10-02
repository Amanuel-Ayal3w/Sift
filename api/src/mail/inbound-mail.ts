export type InboundMail = {
  fromAddress?: string;
  fromName?: string;
  subject?: string;
  text?: string;
  messageId?: string;
  autoSubmitted?: string;
};

export type InboundLead = {
  fullName: string;
  email: string;
  message: string;
  source: 'Email';
  subject?: string;
  replyToMessageId?: string;
};

function sameAddress(left: string, right: string): boolean {
  return left.trim().toLowerCase() === right.trim().toLowerCase();
}

/** Turns one received message into a lead, or skips mail we should not score. */
export function leadFromInboundMail(
  mail: InboundMail,
  mailboxAddress: string,
): InboundLead | null {
  const email = mail.fromAddress?.trim();
  if (!email || !email.includes('@')) return null;
  if (mailboxAddress && sameAddress(email, mailboxAddress)) return null;

  const auto = mail.autoSubmitted?.trim().toLowerCase();
  if (auto && auto !== 'no') return null;

  const subject = mail.subject?.trim() || undefined;
  const body = mail.text?.trim() ?? '';
  const message = [subject, body].filter(Boolean).join('\n\n').slice(0, 10_000);
  if (!message) return null;

  const fullName = mail.fromName?.trim() || email.split('@')[0] || email;
  return {
    fullName: fullName.slice(0, 200),
    email,
    message,
    source: 'Email',
    subject,
    replyToMessageId: mail.messageId?.trim() || undefined,
  };
}

export function replySubject(orgName: string, subject?: string): string {
  const trimmed = subject?.trim();
  if (!trimmed) return `Thanks for reaching out to ${orgName}`;
  return /^re:/i.test(trimmed) ? trimmed : `Re: ${trimmed}`;
}
