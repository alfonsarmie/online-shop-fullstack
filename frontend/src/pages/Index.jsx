import ContainerHome from '../components/ContainerHome.jsx';
import PreProducts from '../components/PreProducts.jsx';
import DinamicsImgContainer from '../components/DinamicsImgContainer.jsx';
import Products from '../components/Products.jsx';
import WhatsAppButton from '../components/WhatsAppButton.jsx';

// Main Index component rendering home page sections
function Index() {
  return (
    <>     
      <ContainerHome />
      <PreProducts />
      <DinamicsImgContainer />
      <Products />
      <WhatsAppButton />
    </>
  );
}

export default Index;