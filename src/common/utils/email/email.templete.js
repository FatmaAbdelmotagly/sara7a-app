
import { APPLICATION_NAME } from "../../../config.js";
import { EmailSubjectEnum } from "../../enum/email.enum.js";

export const templetes ={
  [EmailSubjectEnum.CONFIRM_EMAIL] : (data)=>`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.subject}</title>
</head>

<body style="margin:0; padding:25px 10px; background:#f7f3fc;
  font-family:Arial,Helvetica,sans-serif; color:#39366f;">

  <table role="presentation" width="100%" cellpadding="0"
    cellspacing="0" style="max-width:600px; margin:auto;
    background:#fffdfb; border-radius:20px; overflow:hidden;">

    <tr>
      <td style="padding:28px 30px; font-size:24px;
        font-weight:bold; color:#51458c;">
        ♡ ${APPLICATION_NAME}
      </td>
    </tr>

    <tr>
      <td align="center" style="padding:30px 20px;
        background:#f1eafb;">
        <div style="font-size:65px;">💌</div>
        <p style="font-size:12px; letter-spacing:2px;
          color:#8d72bd; font-weight:bold;">
          A LITTLE NOTE FOR YOU
        </p>
      </td>
    </tr>

    <tr>
      <td style="padding:35px 30px; text-align:center;">

        <h1 style="font-size:27px; line-height:1.4;
          color:#39366f; margin:0 0 20px;">
          ${data.subject} ♡
        </h1>

        <p style="font-size:15px; line-height:1.9;
          color:#68658c; margin-bottom:25px;">
          We're happy to have you here!
          Use the verification code below to verify
          your email address and continue.
        </p>

        <table role="presentation" align="center"
          cellpadding="0" cellspacing="0"
          style="background:#fff0f5; border-radius:15px;">
          <tr>
            <td align="center" style="padding:22px 35px;">
              <p style="font-size:12px; color:#a65f85;
                margin:0 0 10px; letter-spacing:2px;">
                YOUR VERIFICATION CODE
              </p>

              <p style="font-size:32px; font-weight:bold;
                letter-spacing:8px; color:#c75d94; margin:0;">
                ${data.code}
              </p>
            </td>
          </tr>
        </table>

        <p style="font-size:13px; line-height:1.8;
          color:#8d86aa; margin:25px 0 0;">
          If you didn't request this code, you can safely
          ignore this email.
        </p>

      </td>
    </tr>

    <tr>
      <td align="center" style="padding:25px 20px;
        border-top:1px solid #f0e9f7;">
        <p style="font-size:17px; font-weight:bold;
          color:#51458c; margin:0 0 10px;">
          ♡ ${APPLICATION_NAME}
        </p>

        <p style="font-size:12px; line-height:1.8;
          color:#a19ab9; margin:0;">
          Made with love, just for you.
          <br>
          This is an automated email. Please do not reply.
        </p>
      </td>
    </tr>

  </table>
</body>
</html>
`,
  [EmailSubjectEnum.FORGET_PASSWORD] : (data)=>`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.subject}</title>
</head>

<body style="margin:0; padding:25px 10px; background:#f7f3fc;
  font-family:Arial,Helvetica,sans-serif; color:#39366f;">

  <table role="presentation" width="100%" cellpadding="0"
    cellspacing="0" style="max-width:600px; margin:auto;
    background:#fffdfb; border-radius:20px; overflow:hidden;">

    <tr>
      <td style="padding:28px 30px; font-size:24px;
        font-weight:bold; color:#51458c;">
        ♡ ${APPLICATION_NAME}
      </td>
    </tr>

    <tr>
      <td align="center" style="padding:30px 20px;
        background:#f1eafb;">
        <div style="font-size:65px;">💌</div>
        <p style="font-size:12px; letter-spacing:2px;
          color:#8d72bd; font-weight:bold;">
          A LITTLE NOTE FOR YOU
        </p>
      </td>
    </tr>

    <tr>
      <td style="padding:35px 30px; text-align:center;">

        <h1 style="font-size:27px; line-height:1.4;
          color:#39366f; margin:0 0 20px;">
          ${data.subject} ♡
        </h1>

        <p style="font-size:15px; line-height:1.9;
          color:#68658c; margin-bottom:25px;">
          We're happy to have you here!
          Use the verification code below to verify
          your email address and continue.
        </p>

        <table role="presentation" align="center"
          cellpadding="0" cellspacing="0"
          style="background:#fff0f5; border-radius:15px;">
          <tr>
            <td align="center" style="padding:22px 35px;">
              <p style="font-size:12px; color:#a65f85;
                margin:0 0 10px; letter-spacing:2px;">
                YOUR VERIFICATION CODE
              </p>

              <p style="font-size:32px; font-weight:bold;
                letter-spacing:8px; color:#c75d94; margin:0;">
                ${data.code}
              </p>
            </td>
          </tr>
        </table>

        <p style="font-size:13px; line-height:1.8;
          color:#8d86aa; margin:25px 0 0;">
          If you didn't request this code, you can safely
          ignore this email.
        </p>

      </td>
    </tr>

    <tr>
      <td align="center" style="padding:25px 20px;
        border-top:1px solid #f0e9f7;">
        <p style="font-size:17px; font-weight:bold;
          color:#51458c; margin:0 0 10px;">
          ♡ ${APPLICATION_NAME}
        </p>

        <p style="font-size:12px; line-height:1.8;
          color:#a19ab9; margin:0;">
          Made with love, just for you.
          <br>
          This is an automated email. Please do not reply.
        </p>
      </td>
    </tr>

  </table>
</body>
</html>
`,
[EmailSubjectEnum.TWO_STEP_VERIFICATION]: (data) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.subject}</title>
</head>
<body style="margin:0; padding:25px 10px; background:#f7f3fc; font-family:Arial,Helvetica,sans-serif; color:#39366f;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
    style="max-width:600px; margin:auto; background:#fffdfb; border-radius:20px;">
    <tr>
      <td style="padding:28px 30px; font-size:24px; font-weight:bold; color:#51458c;">
        ♡ ${APPLICATION_NAME}
      </td>
    </tr>
    <tr>
      <td align="center" style="padding:30px 20px; background:#f1eafb;">
        <div style="font-size:65px;">🔐</div>
        <p style="font-size:12px; letter-spacing:2px; color:#8d72bd; font-weight:bold;">
          YOUR ACCOUNT SECURITY
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:35px 30px; text-align:center;">
        <h1 style="font-size:27px; color:#39366f;">
          One More Step to Sign In ♡
        </h1>
        <p style="font-size:15px; line-height:1.9; color:#68658c;">
          Use the verification code below to complete your login.
          Please don't share this code with anyone.
        </p>
        <table role="presentation" align="center" cellpadding="0" cellspacing="0"
          style="background:#fff0f5; border-radius:15px;">
          <tr>
            <td align="center" style="padding:22px 35px;">
              <p style="font-size:12px; color:#a65f85; letter-spacing:2px;">
                YOUR LOGIN CODE
              </p>
              <p style="font-size:32px; font-weight:bold; letter-spacing:8px; color:#c75d94;">
                ${data.code}
              </p>
            </td>
          </tr>
        </table>
        <p style="font-size:13px; line-height:1.8; color:#8d86aa; margin-top:25px;">
          If you didn't try to sign in, you can safely ignore this email
          and consider changing your password.
        </p>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding:25px 20px; border-top:1px solid #f0e9f7;">
        <p style="font-size:17px; font-weight:bold; color:#51458c;">
          ♡ ${APPLICATION_NAME}
        </p>
        <p style="font-size:12px; color:#a19ab9;">
          This is an automated email. Please do not reply.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`,
}

export const verifyEmailTemplate = (data) => {

  const html = templetes[data.subject](data);
  return html;
};

