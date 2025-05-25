import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Home = () => {
  return (
    <div className="container mt-5 text-center">
      <h1>Welcome to Workout Tracker</h1>
      <p>Track and manage your daily workouts.</p>

      <div style={{ width: 500, margin: '0 auto' }}>
        <DotLottieReact
          src="/animation.lottie" // ✅ Correct path
          autoplay
          loop
        />
      </div>
    </div>
  );
};

export default Home;
