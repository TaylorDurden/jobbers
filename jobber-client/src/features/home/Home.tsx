import { FC, ReactElement } from 'react';
import HomeSlider from './components/HomeSlider';
import HomeGigsView from './components/HomeGigsView';
import { ISellerGig } from '../gigs/interfaces/gig.interface';

const Home: FC = (): ReactElement => {
  const categoryGigs: ISellerGig[] = [
    {
      id: '1',
      title: '',
      description: '',
      categories: '',
      subCategories: [],
      tags: [],
      expectedDelivery: '',
      basicTitle: '',
      basicDescription: '',
      price: 0,
      coverImage: ''
    },
    {
      id: '2',
      title: '',
      description: '',
      categories: '',
      subCategories: [],
      tags: [],
      expectedDelivery: '',
      basicTitle: '',
      basicDescription: '',
      price: 0,
      coverImage: ''
    }
  ];
  return (
    <div className="m-auto px-6 w-screen relative min-h-screen xl:container md:px-12 lg:px-6">
      <HomeSlider />

      <HomeGigsView gigs={categoryGigs} title="Because you viewed a gig on" subTitle="" category={categoryGigs[0].categories} />
    </div>
  );
};

export default Home;
