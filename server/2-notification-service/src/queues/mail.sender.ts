import { getLogger, sendEmailByTemplate } from '@notifications/helpers';
import { IEmailLocals } from '@taylordurden/jobber-shared';
import { Logger } from 'winston';

const log: Logger = getLogger('mailTransport', 'debug');

async function sendEmail(template: string, receiverEmail: string, locals: IEmailLocals): Promise<void> {
  try {
    sendEmailByTemplate(template, receiverEmail, locals);
    log.info('Email sent successfully.');
  } catch (error) {
    log.log('error', 'NotificationService MailTransport sendEmail() method error:', error);
  }
}

export { sendEmail };
