import ContainerHome from '../components/ContainerHome';
import PreProducts from '../components/PreProducts';
import DinamicsImgContainer from '../components/DinamicsImgContainer';
import Products from '../components/Products';
import WhatsAppButton from '../components/WhatsAppButton';

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