import nodemailer from 'nodemailer';
import config from '../config/config';
import { logger } from '../config/logger';
import path from 'path';
import { keys } from 'lodash';
import * as fs from 'fs';
import { appError } from './appError';
const transporter = nodemailer.createTransport({
    host: config.email.smtp.host,
    port: config.email.smtp.port,    
    secure: false,
    requireTLS: true,
    auth: {
        user: config.email.smtp.auth.user || '',
        pass: config.email.smtp.auth.pass || '',
    },        
});

export const sendMail = async (to: string, subject: string, replaceData : any,text: string = "") => {
  try {    
    let html = "";
    const templatesDir = path.resolve(`${__dirname}/../`, "templates");
    const content = `${templatesDir}/otp.html`;
    
    html = getHtmlContent(content, replaceData);  
    const mailOptions = {
      from: `The YOMO <${config.email.from}>`,
      html,
      replyTo: config.email.default_reply_to,
      subject,
      to: to,
      bcc: [],
      text
  };
    // Send the email
     await transporter.sendMail(mailOptions).then((data) =>{
      console.log("info",data);    
      logger.info('Email sent:', data.messageId);
      return true;
    }).catch((error) =>{
      throw new appError(error.statusCode, error.message)      
    })   
  } catch (error) {                
    logger.error('Error sending email:', error);
  }
};

 const  getHtmlContent = (filePath: string, replaceData: any) => {
  const data = fs.readFileSync(filePath);
  let html = data.toString();
  keys(replaceData).forEach((key) => {
      html = html.replace(key, replaceData[key]);
  });
  return html;
}

module.exports = {
    sendMail
}