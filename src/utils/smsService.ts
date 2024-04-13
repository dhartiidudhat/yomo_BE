import httpStatus from 'http-status';
import twilio from 'twilio';
import config from '../config/config';
import { appError } from './appError';
import { message } from './messages';

export const sendMessage =async (mobile:number, countryCode: string, messageBody: string) => {
    try {
       const client: any = twilio(config.message.twilioId, config.message.twilioToken);
       await client.messages.create({
        body: messageBody,
        from: config.message.twilioFrom,
        to: `+${countryCode}${mobile}`
       })
       return true;
      } catch (error) {
        // Error sending the message
        throw new appError(httpStatus.SERVICE_UNAVAILABLE, message.SERVICE_UNAVILABLE);
      }
}