import { leadFromInboundMail, replySubject } from './inbound-mail.js';

describe('leadFromInboundMail', () => {
  const mailbox = 'sift@gmail.com';

  it('builds a lead from a received message', () => {
    expect(
      leadFromInboundMail(
        {
          fromAddress: 'maya@gmail.com',
          fromName: 'Maya Chen',
          subject: 'Pricing for 40 people',
          text: 'We have budget this quarter.',
          messageId: '<abc@mail.gmail.com>',
        },
        mailbox,
      ),
    ).toEqual({
      fullName: 'Maya Chen',
      email: 'maya@gmail.com',
      message: 'Pricing for 40 people\n\nWe have budget this quarter.',
      source: 'Email',
      subject: 'Pricing for 40 people',
      replyToMessageId: '<abc@mail.gmail.com>',
    });
  });

  it('skips the mailbox itself and automatic mail', () => {
    expect(
      leadFromInboundMail(
        { fromAddress: 'sift@gmail.com', text: 'loop' },
        mailbox,
      ),
    ).toBeNull();
    expect(
      leadFromInboundMail(
        { fromAddress: 'maya@gmail.com', text: 'out of office', autoSubmitted: 'auto-replied' },
        mailbox,
      ),
    ).toBeNull();
  });
});

describe('replySubject', () => {
  it('threads on the original subject and falls back when there is none', () => {
    expect(replySubject('Alet Systems', 'Pricing')).toBe('Re: Pricing');
    expect(replySubject('Alet Systems', 'Re: Pricing')).toBe('Re: Pricing');
    expect(replySubject('Alet Systems')).toBe('Thanks for reaching out to Alet Systems');
  });
});
