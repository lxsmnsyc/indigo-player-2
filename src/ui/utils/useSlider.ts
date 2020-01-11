import { MutableRefObject } from 'react';
import useIsomorphicEffect from '../hooks/useIsomorphicEffect';

export interface SliderState {
  hover: boolean;
  seeking: boolean;
  percentage: number;
}

export type SliderCallback = (state: SliderState, prev: SliderState) => void;

export default function useSlider(
  ref: MutableRefObject<HTMLElement>,
  onChange: SliderCallback,
): void {
  useIsomorphicEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const element = ref.current;

    let state: SliderState = {
      hover: false,
      seeking: false,
      percentage: 0,
    };

    const setState = (newState: Partial<SliderState>): SliderState => {
      const prevState = state;
      state = {
        ...state,
        ...newState,
      };
      return prevState;
    };

    const calcSliderPercentage = (pageX: number): number => {
      const scrollX = window.scrollX || window.pageXOffset;

      const bounding = element.getBoundingClientRect();
      let percentage = (pageX - (bounding.left + scrollX)) / bounding.width;
      percentage = Math.min(Math.max(percentage, 0), 1);

      return percentage;
    };

    const onMouseEnter = (): void => {
      const prevState = setState({ hover: true });
      onChange(state, prevState);
    };

    const onMouseLeave = (): void => {
      const prevState = setState({ hover: false });
      onChange(state, prevState);
    };

    const onMouseDown = (event: MouseEvent): void => {
      event.preventDefault();

      const prevState = setState({
        seeking: true,
        percentage: calcSliderPercentage(event.pageX),
      });

      onChange(state, prevState);
    };

    const onWindowMouseMove = (event: MouseEvent): void => {
      if (state.hover || state.seeking) {
        const prevState = setState({
          percentage: calcSliderPercentage(event.pageX),
        });
        onChange(state, prevState);
      }
    };

    const onWindowMouseUp = (): void => {
      if (state.seeking) {
        const prevState = setState({
          seeking: false,
        });
        onChange(state, prevState);
      }
    };

    const onTouchStart = (event: TouchEvent): void => {
      event.preventDefault();

      if (event.touches.length) {
        const prevState = setState({
          hover: true,
          seeking: true,
          percentage: calcSliderPercentage(event.touches[0].pageX),
        });

        onChange(state, prevState);
      }
    };

    const onWindowTouchMove = (event: TouchEvent): void => {
      if (event.touches.length) {
        const prevState = setState({
          percentage: calcSliderPercentage(event.touches[0].pageX),
        });

        onChange(state, prevState);
      }
    };

    const onWindowTouchEnd = (): void => {
      if (state.seeking) {
        const prevState = setState({
          hover: false,
          seeking: false,
        });

        onChange(state, prevState);
      }
    };

    element.addEventListener('mouseenter', onMouseEnter);
    element.addEventListener('mouseleave', onMouseLeave);
    element.addEventListener('mousedown', onMouseDown);
    element.addEventListener('touchstart', onTouchStart, {
      passive: false,
    });

    window.addEventListener('mousemove', onWindowMouseMove);
    window.addEventListener('touchmove', onWindowTouchMove, {
      passive: false,
    });
    window.addEventListener('mouseup', onWindowMouseUp);
    window.addEventListener('touchend', onWindowTouchEnd, {
      passive: false,
    });

    return (): void => {
      element.removeEventListener('mouseenter', onMouseEnter);
      element.removeEventListener('mouseleave', onMouseLeave);
      element.removeEventListener('mousedown', onMouseDown);
      element.removeEventListener('touchstart', onTouchStart);

      window.removeEventListener('mousemove', onWindowMouseMove);
      window.removeEventListener('touchmove', onWindowTouchMove);
      window.removeEventListener('mouseup', onWindowMouseUp);
      window.removeEventListener('touchend', onWindowTouchEnd);
    };
  }, [ref.current, onChange]);
}
