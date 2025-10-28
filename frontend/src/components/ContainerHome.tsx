import '../index.css';
import '../styles/containerHome.css';
import { useEffect } from 'react';

function ContainerHome() {

    useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    });

    reveals.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);
  
  return (
    <div className="contenedorInicio">
        <div className="opaco"></div>
        <div className="textosInicio">
            <h1 className="reveal">TIENDA OFICIAL</h1>
            <h2 className="reveal">ROSARIO ROWING CLUB</h2>
        </div>
        <div className="scroll-down-indicator">
        <i className="fas fa-chevron-down"></i> </div>
    </div>
  );
}

export default ContainerHome;