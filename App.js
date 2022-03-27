import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/navigation';
import WatchlistProvider from './src/contexts/WatchlistContext';
import { RecoilRoot } from 'recoil';
import SplashScreen from './src/Screens/SplashScreen';

function App() {
  const [showSplashScreen, setShowSplashScreen] = React.useState(true);
  React.useEffect(() => {
    setTimeout(() => {
      setShowSplashScreen(false);
    }, 2500);
  }, []);
  return (
    <NavigationContainer
      theme={{
        colors: {
          background: '#121212',
        },
      }}
    >
      <RecoilRoot>
        <WatchlistProvider>
          {showSplashScreen ? <SplashScreen /> : <Navigation />}
        </WatchlistProvider>
      </RecoilRoot>
    </NavigationContainer>
  );
}

export default App;
