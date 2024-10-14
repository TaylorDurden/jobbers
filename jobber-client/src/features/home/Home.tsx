import { FC, ReactElement } from 'react';
import { ISellerDocument } from 'src/features/sellers/interfaces/seller.interface';
import HomeSlider from './components/HomeSlider';
import HomeGigsView from './components/HomeGigsView';
import { ISellerGig } from '../gigs/interfaces/gig.interface';
import FeaturedExperts from './components/FeaturedExperts';

const Home: FC = (): ReactElement => {
  const gig = {
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
  };
  const categoryGigs: ISellerGig[] = [gig, gig, gig, gig, gig];
  const sellerDoc = {
    fullName: '',
    description: '',
    country: '',
    oneliner: '',
    skills: [],
    languages: [],
    responseTime: 0,
    experience: [],
    education: [],
    socialLinks: [],
    certificates: []
  };
  const sellers: ISellerDocument[] = [sellerDoc, sellerDoc, sellerDoc, sellerDoc, sellerDoc, sellerDoc];

  return (
    <div className="m-auto px-6 w-screen relative min-h-screen xl:container md:px-12 lg:px-6">
      <HomeSlider />
      <HomeGigsView gigs={categoryGigs} title="Because you viewed a gig on" subTitle="" category={categoryGigs[0].categories} />
      <FeaturedExperts sellers={sellers} />
    </div>
  );
};

export default Home;
