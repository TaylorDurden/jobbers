import { Dispatch } from '@reduxjs/toolkit';
import countries, { LocalizedCountryNames } from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import { filter } from 'lodash';
import { NavigateFunction } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logout } from 'src/features/auth/reducers/logout.reducer';
import { IOrderDocument } from 'src/features/order/interfaces/order.interface';

countries.registerLocale(enLocale);

export const lowerCase = (str: string): string => {
  return str.toLowerCase();
};

export const firstLetterUppercase = (str: string): string => {
  const valueString = lowerCase(`${str}`);
  return `${valueString.charAt(0).toUpperCase()}${valueString.slice(1).toLowerCase()}`;
};

export const replaceSpacesWithDash = (title: string): string => {
  const lowercaseTitle: string = lowerCase(`${title}`);
  return lowercaseTitle.replace(/\/| /g, '-'); // replace / and space with -
};

export const replaceDashWithSpaces = (title: string): string => {
  const lowercaseTitle: string = lowerCase(`${title}`);
  return lowercaseTitle.replace(/-|\/| /g, ' '); // replace - / and space with -
};

export const replaceAmpersandWithSpace = (title: string): string => {
  return title.replace(/&/g, '');
};

export const replaceAmpersandAndDashWithSpace = (title: string): string => {
  const titleWithoutDash = replaceDashWithSpaces(title);
  return titleWithoutDash.replace(/&| /g, ' ');
};

export const saveToSessionStorage = (data: string, username: string): void => {
  window.sessionStorage.setItem('isLoggedIn', data);
  window.sessionStorage.setItem('loggedInUser', username);
};

export const getDataFromSessionStorage = (key: string) => {
  const data = window.sessionStorage.getItem(key) as string;
  return JSON.parse(data);
};

export const saveToLocalStorage = (key: string, data: string): void => {
  window.localStorage.setItem(key, data);
};

export const getDataFromLocalStorage = (key: string) => {
  const data = window.localStorage.getItem(key) as string;
  return JSON.parse(data);
};

export const deleteFromLocalStorage = (key: string): void => {
  window.localStorage.removeItem(key);
};

export const categories = (): string[] => {
  return [
    'Graphics & Design',
    'Digital Marketing',
    'Writing & Translation',
    'Video & Animation',
    'Music & Audio',
    'Programming & Tech',
    'Photography',
    'Data',
    'Business'
  ];
};

export const countriesList = (): string[] => {
  const countriesObj: LocalizedCountryNames<{ select: 'official' }> = countries.getNames('en', { select: 'official' });
  return Object.values(countriesObj);
};

export const applicationLogout = async (dispatch: Dispatch, navigate: NavigateFunction) => {
  const loggedInUsername: string = getDataFromSessionStorage('loggedInUser');
  dispatch(logout({}));
  // Dynamically access `authApi` and `api` once the page is loaded
  const { authApi } = await import('src/features/auth/services/auth.service');
  const { api } = await import('src/store/api');
  if (loggedInUsername) {
    dispatch(authApi.endpoints.removeLoggedInUser.initiate(`${loggedInUsername}`, { track: false }) as never);
  }
  dispatch(api.util.resetApiState());
  dispatch(authApi.endpoints.logout.initiate() as never);
  saveToSessionStorage(JSON.stringify(false), JSON.stringify(''));
  deleteFromLocalStorage('becomeASeller');
  navigate('/');
};

export const showSuccessToast = (message: string): void => {
  toast.success(message, {
    position: 'bottom-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: 'colored'
  });
};

export const showErrorToast = (message: string): void => {
  toast.error(message, {
    position: 'bottom-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: 'colored'
  });
};

export const rating = (num: number): number => {
  if (num) {
    return Math.round(num * 10) / 10;
  }
  return 0.0;
};

export const orderTypes = (status: string, orders: IOrderDocument[]): number => {
  const orderList: IOrderDocument[] = filter(orders, (order: IOrderDocument) => lowerCase(order.status) === lowerCase(status));
  return orderList.length;
};

export const yearsList = (maxOffset: number): string[] => {
  const years: string[] = [];
  const currentYear: number = new Date().getFullYear();
  for (let i = 0; i <= maxOffset; i++) {
    const year: number = currentYear - i;
    years.push(`${year}`);
  }
  return years;
};

export const degreeList = (): string[] => {
  return ['Associate', 'B.A.', 'B.Sc.', 'M.A.', 'M.B.A.', 'M.Sc.', 'J.D.', 'M.D.', 'Ph.D.', 'LLB', 'Certificate', 'Other'];
};

export const languageLevel = (): string[] => {
  return ['Basic', 'Conversational', 'Fluent', 'Native'];
};
