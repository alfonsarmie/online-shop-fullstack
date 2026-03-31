// backend/src/helpers/email-templates.ts

export const getActivationEmailHtml = (activationUrl: string, logoUrl: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Afacad:wght@400;600&family=Anton&display=swap');
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Afacad', Arial, sans-serif;">
      <table role="presentation" width="100%" border="0" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              
              <tr>
                <td style="background-color: #1d1d1d; padding: 20px; text-align: center; border-bottom: 3px solid #1e7335;">
                  <img src="${logoUrl}" alt="Rowing Tienda" width="150" style="display: block; margin: 0 auto; max-width: 100%; border: 0;">
                </td>
              </tr>

              <tr>
                <td style="padding: 40px 30px; text-align: center;">
                  <h1 style="color: #1d1d1d; font-family: 'Anton', sans-serif; letter-spacing: 1px;">¡BIENVENIDO AL EQUIPO!</h1>
                  <p style="color: #555; font-size: 16px; margin-bottom: 30px;">
                    Gracias por registrarte. Para activar tu cuenta y empezar a comprar, hacé clic en el botón de abajo.
                  </p>
                  
                  <a href="${activationUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #1e7335, #145225); color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 8px; font-family: 'Afacad', sans-serif;">
                    ACTIVAR MI CUENTA
                  </a>

                  <p style="margin-top: 30px; font-size: 12px; color: #999;">
                    Si no funciona, copiá este link: <br>
                    <a href="${activationUrl}" style="color: #1e7335;">${activationUrl}</a>
                  </p>
                </td>
              </tr>
              
              <tr>
                <td style="background-color: #1c1c1e; padding: 20px; text-align: center; color: #888;">
                  <p style="font-size: 12px; margin: 0;">© 2025 Rowing Tienda</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};