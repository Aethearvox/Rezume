import { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Loader from '../components/Loader';

import Shiba from '../models/shiba';
import Sky from '../models/Sky';
import Bird from '../models/Bird';
import Plane from '../models/Plane';
import HomeInfo from '../components/Homeinfo';

const Home = () => { 
  const [isRotating, setIsRotating] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [shibaScale, setShibaScale] = useState([1, 1, 1]);
  const [shibaPosition, setShibaPosition] = useState([0, -6.5, -43]);
  const [shibaRotation, setShibaRotation] = useState([0.1, 4.7, 0]);

  // Adjust scale and position of Shiba based on screen size
  const adjustShibaForScreenSize = () => {
    let screenScale = null;
    let screenPosition = [0, -6.5, -43];
    let rotation = [0.1, 4.7, 0];

    if (window.innerWidth < 768) {
      screenScale = [0.9, 0.9, 0.9];
    } else {
      screenScale = [1, 1, 1];
    }

    return [screenScale, screenPosition, rotation];
  };

  useEffect(() => {
    // Update scale and position when window resizes
    const handleResize = () => {
      const [scale, position, rotation] = adjustShibaForScreenSize();
      setShibaScale(scale);
      setShibaPosition(position);
      setShibaRotation(rotation);
    };

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Initial adjustment on first render
    handleResize();

    // Clean up on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const adjustPlaneForScreenSize = () => {
    let screenScale, screenPosition;

    if (window.innerWidth < 768) {
      screenScale = [1.5, 1.5, 1.5];
      screenPosition = [0, -1.5, 0];
    } else {
      screenScale = [3, 3, 3];
      screenPosition = [0, -4, -4];
    }

    return [screenScale, screenPosition];
  };

  const [planeScale, planePosition] = adjustPlaneForScreenSize();

  return (
    <section className="w-full h-screen relative">
      <div className="absolute top-28 left-0 right-0 z-10 flex items-center justify-center">
        {currentStage && <HomeInfo currentStage={currentStage} />}
      </div>

      <Canvas 
        className={`w-full h-screen bg-transparent ${isRotating ? 'cursor-grabbing' : 'cursor-grab'}`}
        camera={{ near: 0.1, far: 1000 }}
      >
        <Suspense fallback={<Loader />}>
          <directionalLight position={[1, 1, 1]} intensity={2} />
          <ambientLight intensity={0.5} />
          <hemisphereLight skyColor="#b1e1ff" groundColor="#000000" intensity={1} />

          <Bird />
          <Sky isRotating={isRotating} />
          <Shiba
            position={shibaPosition}
            scale={shibaScale}
            rotation={shibaRotation}
            isRotating={isRotating}
            setIsRotating={setIsRotating}
            setCurrentStage={setCurrentStage}
          />
        </Suspense>
      </Canvas>
    </section>
  );
};

export default Home;
