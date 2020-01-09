
// eslint-disable-next-line spaced-comment
/// reference path="./types/can-autoplay.d.ts"
import canAutoplayLib from 'can-autoplay';
import { EnvInterface, Config } from '../types';

export default async function getEnv(config: Config): Promise<EnvInterface> {
  const { userAgent } = navigator;

  const canAutoplay: boolean = (await canAutoplayLib.video({
    muted: config.volume === 0,
  })).result;

  const isSafari: boolean = /safari/i.test(userAgent) && !userAgent.includes('Chrome');

  const isEdge: boolean = /edge/i.test(userAgent);

  const isIE: boolean = Boolean((window as any).ActiveXObject)
    || /trident.*rv:1\d/i.test(userAgent);

  const isChrome: boolean = /chrome/i.test(userAgent) && !isEdge;

  const isMobile: boolean = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|IEMobile|Opera Mini/i.test(
    userAgent,
  );

  const isIOS: boolean = /iPad|iPhone|iPod/i.test(userAgent);

  const isFacebook: boolean = /FBAN/i.test(userAgent) && /FBAV/i.test(userAgent);

  return {
    isSafari,
    isEdge,
    isIE,
    isChrome,
    isMobile,
    isIOS,
    isFacebook,
    canAutoplay,
  };
}
