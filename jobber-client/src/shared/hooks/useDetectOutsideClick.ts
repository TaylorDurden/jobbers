import { Dispatch, MutableRefObject, SetStateAction, useCallback, useEffect, useState } from 'react';

const useDetectOutsideClick = (
  ref: MutableRefObject<HTMLDivElement | null>,
  initialState: boolean
): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const [isActive, setIsActive] = useState<boolean>(initialState);
  /**
   * It checks if the referenced DOM element exists (ref.current !== null).
   * This checks if the click occurred inside the referenced element.
   * If the click happens outside of it (!ref.current.contains(event.target)), the state isActive is toggled.
   */
  const handleClick = useCallback(
    (event: MouseEvent): void => {
      if (ref.current !== null && !ref.current.contains(event.target as HTMLDivElement)) {
        setIsActive(!isActive);
      }
    },
    [isActive, ref]
  );

  useEffect(() => {
    if (isActive) {
      window.addEventListener('click', handleClick);
    }

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [isActive, handleClick]);

  return [isActive, setIsActive];
};

export default useDetectOutsideClick;
