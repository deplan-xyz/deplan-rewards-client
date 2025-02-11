import axios from 'axios';
import { Transaction } from '@solana/web3.js';
import { Buffer } from 'buffer';
import { ClaimData } from './types';
import { CheckTwitterFollowStatusResponse } from './types';

const isDev = import.meta.env.DEV;

const baseURL = 'https://equitywallet-b362155a0894.herokuapp.com';
const baseURLDev = 'http://localhost:9899';

const instance = axios.create({
  baseURL: isDev ? baseURLDev : baseURL,
  headers: {
    'x-tzoffset': new Date().getTimezoneOffset(),
  },
});

enum Routes {
  CLAIM_DATA = '/rewards/:wallet',
  CLAIM = '/rewards/:wallet/claim/transaction',
  TWITTER_GET_AUTH_URL = '/rewards/twitter/auth/url',
  TWITTER_FOLLOW = '/socials/twitter/follow',
  TWITTER_FOLLOW_CHECK = '/socials/twitter/follow/check'
}

export const fetchClaimData = async (wallet: string): Promise<ClaimData> => {
  try {
    const response = await instance.get(
      Routes.CLAIM_DATA.replace(':wallet', wallet)
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching claim data', error);
    throw error;
  }
};

export const claim = async (
  wallet: string,
): Promise<Transaction> => {
  try {
    const { data: encodedTransaction } = await instance.get<ClaimData>(
      Routes.CLAIM.replace(':wallet', wallet)
    );

    const transaction = Transaction.from(
      Buffer.from(encodedTransaction.txnHash, 'base64')
    );

    return transaction;
  } catch (error) {
    console.error('Error claiming', error);
    throw error;
  }
};

export const claimSend = async (wallet: string, txn: string): Promise<void> => {
  try {
    await instance.post<ClaimData>(Routes.CLAIM.replace(':wallet', wallet), {
      txn
    });
  } catch (error) {
    console.error('Error claiming', error);
    throw error;
  }
};

export const followTwitter = async (wallet: string): Promise<string> => {
  try {
    const followUrl = await instance.get(Routes.TWITTER_FOLLOW, {
      params: {
        wallet
      }
    });

    return followUrl.data;
  } catch (error) {
    throw new Error('Error following DePlan on Twitter');
  }
};

export const checkIsuserFollowDePlanOnTwitter = async (wallet: string) => {
  try {
    const response = await instance.get<CheckTwitterFollowStatusResponse>(
      Routes.TWITTER_FOLLOW_CHECK,
      {
        params: {
          wallet
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Error checking if user follows DePlan on Twitter');
  }
};
