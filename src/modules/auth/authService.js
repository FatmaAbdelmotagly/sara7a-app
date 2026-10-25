import { UserModel } from "../../DB/Model/userModel.js";
import { findOne, createOne } from "../../common/repository/index.js";
import {
  BadException,
  conflictException,
  notFoundException,
  TooManyRequsetException,
} from "../../common/exceptions/error.exceptions.js";
import {
  compare,
  hash,
  encryption,
  decryption,
  createToken,
  createLoginCredentials,
  userBaseRevokTokenKey,
} from "../../common/security/index.js";
import { emailEvent } from "../../common/utils/email/email.events.js";
import { createOTP } from "../../common/utils/OTP.js";
import { del, expire, get, incBy, keys, set, ttl } from "../../common/service/cache.service.js";
import { EmailSubjectEnum } from "../../common/enum/email.enum.js";
import { UserEmailKey, UserEmailTrialsKey } from "../../common/utils/email/send.email.js";
import { ProviderEnum } from "../../common/enum/securityEnum.js";
import { WEB_CLIENT_IDS } from "../../config.js";

import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client();



const sendEmailOTP = async ({email , subject , maxTrials = 7 , blockInSeconds=300 })=>{

  const existOTP_ttl = await ttl({
    key: UserEmailKey({email , subject})
  })
  if (existOTP_ttl > 0){
    throw conflictException(`we can not send a new otp while the current one is valid , please try again after ${existOTP_ttl}s`)
  }
  const oldTrials = await get ({key : UserEmailTrialsKey({email , subject})}) ?? 0
  if(oldTrials >= maxTrials){
    throw TooManyRequsetException("maximum number of trials has been reatched ")
  }

  const code = createOTP();
  await set({
    key: UserEmailKey({ email, subject}),
    value: await hash(code.toString()),
    ttl: 120,
  });

const trials = await incBy({key :  UserEmailTrialsKey({email , subject})})
if(trials == maxTrials ){
  await expire({  key : UserEmailTrialsKey({email , subject}) , ttl : blockInSeconds})

}
  emailEvent.emit("sendEmail", {
    recipients: { to: email },
    data: { code, subject },
  });


}

export const signup = async (inputs) => {
  const { username, email, password, phone, age, gender } = inputs;
  console.log({ username });

  const account = await findOne({
    model: UserModel,
    filter: { email },
  });
  if (account) {
    throw conflictException("email exists");
  }

  const user = await createOne({
    model: UserModel,
    data: {
      username,
      email,
      password: await hash(password),
      phone: await encryption(phone),
      age,
      gender,
    },
  });

  await sendEmailOTP({email , subject : EmailSubjectEnum.CONFIRM_EMAIL})

  return user;
};

async function verifyGoogleAccount(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: WEB_CLIENT_IDS, // Specify the WEB_CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  if (!payload.email_verified) {
    throw BadException("email not verified ");
  }
  return payload;
}

export const signupWithGmail = async ({ idToken }, issuer) => {
  const { email, name, picture } = await verifyGoogleAccount(idToken);

  const existAccount = await findOne({
    model: UserModel,
    filter: { email },
  });

  if (existAccount) {
    if (existAccount.provider != ProviderEnum.GOOGLE) {
      throw conflictException("invalid account provider");
    }

    return {
      status: 200,
      data: await createLoginCredentials({ user: existAccount, issuer }),
    };
  }
  const user = await createOne({
    model: UserModel,
    data: {
      provider: ProviderEnum.GOOGLE,
      confirmEmail: Date.now(),
      email,
      username: name,
      Image: picture,
    },
  });

  return { status: 201, data: await createLoginCredentials({ user, issuer }) };
};

export const confirmEmail = async ({ otp, email }) => {
  const account = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: false },
    },
  });

  if (!account) throw new notFoundException("Invalid account");

  const hashOtp = await get({
    key: UserEmailKey({
      email,
      subject: EmailSubjectEnum.CONFIRM_EMAIL,
    }),
  });

  if (!hashOtp || !(await compare(otp, hashOtp))) {
    throw  conflictException("Invalid OTP");
  }

  account.confirmEmail = new Date();
  await account.save();
  await del({
    key: await keys({prefix :  UserEmailKey({email , subject :EmailSubjectEnum.CONFIRM_EMAIL})}),
  });

  return;
};
export const confirmForgetPasswordCode = async ({ otp, email }) => {
  const account = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: true },
    },
  });

  if (!account) throw new notFoundException("Invalid account");

  const hashOtp = await get({
    key: UserEmailKey({
      email,
      subject: EmailSubjectEnum.FORGET_PASSWORD,
    }),
  });

  if (!hashOtp || !(await compare(otp, hashOtp))) {
    throw  conflictException("Invalid OTP");
  }

  return account;
};

export const resendconfirmEmail = async ({ email }) => {
  const account = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: false },
    },
  });

  if (!account) throw new notFoundException("Invalid account");
await sendEmailOTP({email , subject : EmailSubjectEnum.CONFIRM_EMAIL})

  return;
};
export const forgetPassword = async ({ email }) => {
  const account = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: true },
    },
  });


  if (!account) throw  notFoundException("Invalid account");

await sendEmailOTP({email , subject : EmailSubjectEnum.FORGET_PASSWORD})

return 
};

export const resetForgotPassword = async ({ otp, email, password }) => {

  const account = await confirmForgetPasswordCode({ otp, email })
  account.password = await hash(password);
  account.changeCredentialsTime = new Date();
  await account.save();


  const revokePrefix = userBaseRevokTokenKey({
    userID: account._id,
  });

  const otpKey = UserEmailKey({
    email,
    subject: EmailSubjectEnum.FORGET_PASSWORD,
  });

  const result = await Promise.all([
    keys({ prefix: revokePrefix }),
    keys({ prefix: otpKey }),
  ]);

  await del({
    key: [...result[0], ...result[1]],
  });
  return;
};


 const LoginAttemptsKey = ({ email }) => {
  return `Login::${email}::Attempts`;
};
 const LoginBlockKey = ({ email }) => {
  return `Login::${email}::Blocked`;
};






export const login = async ({ email, password }, issuer) => {
  const blockedTime = await ttl({
  key: LoginBlockKey({ email }),
});

if (blockedTime > 0) {
  throw TooManyRequsetException(
    `Too many login attempts. Try again after ${blockedTime} seconds`
  );
}
  const account = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: true },
    },
  });
  if (!account)
    throw notFoundException("Invalid login data", { extra: "kll" });

  const match = await compare(password, account.password);
  console.log({
    password,
    hash: account.password,
    match,
  });

  // if (!match) throw notFoundException("Invalid login data", { extra: "kll" });

  if (!match) {
  const attemptsKey = LoginAttemptsKey({ email });
  const attempts = await incBy({
    key: attemptsKey});
  if (attempts === 1) {
    await expire({ key: attemptsKey,ttl: 10,
    });
  }
  if (attempts >= 5) {
    await set({ key: LoginBlockKey({ email }),value: 1, ttl: 300,});
    await del({ key: attemptsKey });
    throw TooManyRequsetException(
      "Too many login attempts. Try again after 5 minutes"
    );
  }
  throw notFoundException("Invalid login data");
}

  // return createLoginCredentials({ user: account, issuer });
  await sendEmailOTP({
  email: account.email,
  subject: EmailSubjectEnum.TWO_STEP_VERIFICATION,
});

return {
  message: "OTP sent successfully, please check your email",
};
};

export const verifyLoginOTP = async ({ otp, email }, issuer) => {
  const account = await findOne({
  model: UserModel,
  filter: {
    email,
    provider: ProviderEnum.SYSTEM,
    confirmEmail: { $exists: true },
  },
});

if (!account) throw new notFoundException("Invalid account");

const hashOtp = await get({
  key: UserEmailKey({
    email,
    subject: EmailSubjectEnum.TWO_STEP_VERIFICATION,
  }),
});

if (!hashOtp || !(await compare(otp, hashOtp))) {
  throw conflictException("Invalid OTP");
}
await del({
  key: UserEmailKey({
    email,
    subject: EmailSubjectEnum.TWO_STEP_VERIFICATION,
  }),
});

return createLoginCredentials({ user: account,issuer,});
};