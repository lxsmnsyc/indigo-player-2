import React, { useEffect } from 'react';
import IndigoPlayer from '@lxsmnsyc/indigo-player';
import './App.css';

const source = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

function App() {
  const el = React.useRef(null);

  useEffect(() => {
    if (el.current) {
      const config = {
        // Autoplay the video
        autoplay: true,

        // Aspect ratio
        aspectRatio: 16 / 9,

        // initial volume
        volume: 0.5,

        // source
        sources: [
          {
            type: 'hls',
            src: source,
          },
        ],

        // UI
        ui: {
          image: '',

          // enable Picture in Picture
          pip: true,

          // Allow keyboard navigation
          keyboardNavigation: true,
        },
      };

      const { current } = el;

      let instance = IndigoPlayer(current, config);

      return () => {
        instance.destroy();
      };
    }
    return undefined;
  }, []);

  return (
    <div ref={el} />
  );
}

export default App;
