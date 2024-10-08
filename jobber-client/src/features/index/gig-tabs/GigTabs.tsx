import { FC, ReactElement, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { categories, replaceSpacesWithDash } from 'src/shared/utils/utils.service';
import { ISellerGig } from 'src/features/gigs/interfaces/gig.interface';

const GigTabs: FC = (): ReactElement => {
  const cats = categories();
  const [activeTab, setActiveTab] = useState<string>(cats[0]);

  const categoryGigs: ISellerGig[] = [];

  return (
    <div className="relative m-auto mt-8 w-screen px-6 xl:container md:px-12 lg:px-6">
      <div className="mx-auto flex flex-col px-4 py-4 lg:px-6 lg:py-6">
        <div className="flex flex-col text-left">
          <h2 className="mb-3 text-3xl font-bold text-black">A broad selection of services</h2>
          <h4>Choose from a broad selection of services from expert freelancers for your next project.</h4>
        </div>
        <div className="mt-6">
          <ul className="lg:flex lg:justify-between gap-5 overflow-x-auto scroll-smooth whitespace-nowrap relative inline-block">
            {cats.map((category: string) => (
              <li
                key={uuidv4()}
                onClick={() => setActiveTab(category)}
                className={`cursor-pointer font-bold py-2 lg:py-0 ${activeTab === category ? 'text-black' : 'text-gray-400'}`}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 h-full overflow-hidden border px-6 py-6">
          {categoryGigs.length > 0 ? (
            <>
              <a
                className="mt-10 w-[10%] rounded border border-black px-6 py-3 text-center text-sm font-bold text-black hover:bg-gray-100 focus:outline-none md:px-4 md:py-2 md:text-base"
                href={`/search/categories/${replaceSpacesWithDash(activeTab)}`}
              >
                Explore
              </a>
            </>
          ) : (
            <div className="flex h-96 items-center justify-center text-lg">Information not available at the moment.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GigTabs;
