const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client();


export async function googleVerify(token: string) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,  
      // Specify the WEB_CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
  });


  
  const { email, given_name, family_name } = ticket.getPayload();

  return { email, name: given_name, surname: family_name };
}
