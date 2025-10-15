// Utilidad para debugging de órdenes en desarrollo
// Solo usar en desarrollo - NO en producción

declare global {
  interface Window {
    debugOrders: () => void;
    debugLastOrder: () => void;
    debugCheckoutData: () => void;
  }
}

// Función para debuggear órdenes (ejecutar en consola del navegador)
window.debugOrders = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('❌ No hay token de autenticación');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/orders', {
      headers: {
        'x-token': token,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('📋 ÓRDENES ENCONTRADAS:');
    console.table(data.orders?.map((order: any) => ({
      ID: order.idOrder,
      Usuario: order.customer_name,
      Email: order.customer_email,
      Total: `$${order.total_amount}`,
      Estado: order.statusMp,
      Fecha: new Date(order.orderDate).toLocaleString(),
      Deportes: order.sports || 'N/A'
    })));
    
    console.log('📦 DATOS COMPLETOS:', data);
  } catch (error) {
    console.error('❌ Error al obtener órdenes:', error);
  }
};

// Función para debuggear la última orden creada
window.debugLastOrder = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('❌ No hay token de autenticación');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/orders?limit=1', {
      headers: {
        'x-token': token,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    const lastOrder = data.orders?.[0];
    
    if (!lastOrder) {
      console.log('ℹ️ No hay órdenes');
      return;
    }
    
    console.log('🎯 ÚLTIMA ORDEN CREADA:');
    console.log('📄 Información básica:', {
      ID: lastOrder.idOrder,
      Usuario: lastOrder.customer_name,
      Email: lastOrder.customer_email,
      Teléfono: lastOrder.customer_phone,
      Total: `$${lastOrder.total_amount}`,
      Estado: lastOrder.statusMp,
      Fecha: new Date(lastOrder.orderDate).toLocaleString(),
      Deportes: lastOrder.sports,
      Notas: lastOrder.customer_notes || 'N/A'
    });
    
    console.log('🛒 Items de la orden:');
    if (lastOrder.orderLines?.length > 0) {
      console.table(lastOrder.orderLines.map((line: any) => ({
        Producto: line.product_name,
        Cantidad: line.quantity,
        Talle: line.size || 'N/A',
        Subtotal: `$${line.subtotal}`
      })));
    }
    
    console.log('📦 DATOS COMPLETOS:', lastOrder);
  } catch (error) {
    console.error('❌ Error al obtener la última orden:', error);
  }
};

// Función para ver los datos del checkout guardados
window.debugCheckoutData = () => {
  const checkoutData = localStorage.getItem('checkoutData');
  const user = localStorage.getItem('user');
  
  console.log('🔍 DATOS DE CHECKOUT:');
  
  if (checkoutData) {
    const data = JSON.parse(checkoutData);
    console.log('📝 Formulario:', data);
  } else {
    console.log('❌ No hay datos de checkout guardados');
  }
  
  if (user) {
    const userData = JSON.parse(user);
    console.log('👤 Usuario logueado:', {
      ID: userData.idUser,
      Nombre: userData.name,
      Email: userData.email,
      Rol: userData.role
    });
  } else {
    console.log('❌ No hay usuario logueado');
  }
};

// Mostrar instrucciones en consola
console.log(`
🔧 HERRAMIENTAS DE DEBUG DISPONIBLES:

1. debugOrders() - Ver todas las órdenes
2. debugLastOrder() - Ver la última orden creada
3. debugCheckoutData() - Ver datos del checkout guardados

Ejemplo de uso:
debugLastOrder()
`);

export {};