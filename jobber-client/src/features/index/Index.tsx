import React, { FC, ReactElement, Suspense } from 'react';
import Hero from './Hero';
import GigTabs from './gig-tabs/GigTabs';
import HowItWorks from './HowItWorks';
import Categories from './Categories';

const IndexHeader = React.lazy(() => import('src/shared/header/components/Header'));

const Index: FC = (): ReactElement => {
  return (
    <div className="flex flex-col">
      <Suspense>
        <IndexHeader navClass="navbar peer-checked:navbar-active fixed z-20 w-full border-b border-gray-100 bg-white/90 shadow-2xl shadow-gray-600/5 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80 dark:shadow-none" />
        <Hero />
        <GigTabs />
        <HowItWorks />
        <hr />
        <Categories />
      </Suspense>
    </div>
  );
};

export default Index;
