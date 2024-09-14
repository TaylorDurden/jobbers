import { BuyerCollection } from '@users/models/buyer.schema';
import { IBuyerDocument } from '@taylordurden/jobber-shared';

const getBuyerByEmail = async (email: string): Promise<IBuyerDocument | null> => {
  const buyer: IBuyerDocument | null = (await BuyerCollection.findOne({ email }).exec()) as IBuyerDocument;
  return buyer;
};

const getBuyerByUsername = async (username: string): Promise<IBuyerDocument | null> => {
  const buyer: IBuyerDocument | null = (await BuyerCollection.findOne({ username }).exec()) as IBuyerDocument;
  return buyer;
};

const getRandomBuyers = async (count: number): Promise<IBuyerDocument[]> => {
  const buyers: IBuyerDocument[] = await BuyerCollection.aggregate([{ $sample: { size: count } }]);
  return buyers;
};

const createBuyer = async (buyerData: IBuyerDocument): Promise<void> => {
  const checkIfBuyerExist: IBuyerDocument | null = await getBuyerByEmail(`${buyerData.email}`);
  if (!checkIfBuyerExist) {
    await BuyerCollection.create(buyerData);
  }
};

const updateBuyerIsSellerProp = async (email: string): Promise<void> => {
  await BuyerCollection.updateOne(
    { email },
    {
      $set: {
        isSeller: true
      }
    }
  ).exec();
};

const updateBuyerPurchasedGigsProp = async (buyerId: string, purchasedGigId: string, type: string): Promise<void> => {
  await BuyerCollection.updateOne(
    { _id: buyerId },
    type === 'purchased-gigs'
      ? {
          $push: {
            purchasedGigs: purchasedGigId
          }
        }
      : {
          $pull: {
            purchasedGigs: purchasedGigId
          }
        }
  ).exec();
};

export { getBuyerByEmail, getBuyerByUsername, getRandomBuyers, createBuyer, updateBuyerIsSellerProp, updateBuyerPurchasedGigsProp };
