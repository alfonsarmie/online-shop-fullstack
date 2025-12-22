export const getActivationEmailHtml = (activationUrl: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
      <div style="text-align: center; padding-bottom: 20px;">
        <h1 style="color: #333;">¡Bienvenido!</h1>
      </div>
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; text-align: center;">
        <p style="font-size: 16px; color: #555; margin-bottom: 20px;">Gracias por registrarte. Para activar tu cuenta y empezar a comprar, hacé clic en el siguiente botón:</p>
        
        <a href="${activationUrl}" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
          Activar mi Cuenta
        </a>
        
        <p style="margin-top: 30px; font-size: 12px; color: #999;">Si el botón no funciona, podés copiar y pegar este enlace en tu navegador:</p>
        <p style="font-size: 12px; color: #007bff; word-break: break-all;">${activationUrl}</p>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
        <p>© 2025 Tu Tienda Online. Todos los derechos reservados.</p>
      </div>
    </div>
  `;
};