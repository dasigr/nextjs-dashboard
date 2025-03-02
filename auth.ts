import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User, Token } from '@/app/lib/definitions';
import axios from 'axios';

async function getToken(name: string, password: string) {
  try {
    const url = `${process.env.DRUPAL_API_URL}/oauth/token`;

    const data = new URLSearchParams()
    data.append('grant_type', 'password');
    data.append('client_id', `${process.env.DRUPAL_CLIENT_ID}`);
    data.append('client_secret', `${process.env.DRUPAL_CLIENT_SECRET}`);
    data.append('username', `${name}`);
    data.append('password', `${password}`);
    data.append('scope', 'finance');

    const response = await axios.post(url, data, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching token:", error);
  }
}

async function getUserId(token: Token) {
  try {
    const url = `${process.env.DRUPAL_API_URL}/jsonapi`;

    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/vnd.api+json',
        'Authorization': 'Bearer ' + token.access_token
      }
    });

    return response.data.meta.links.me.meta.id;
  } catch (error) {
    console.error("Error fetching user:", error);
  }
}

async function getUser(user_id: string, token: Token) {
  try {
    const url = `${process.env.DRUPAL_API_URL}/jsonapi/user/user/${user_id}`;

    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/vnd.api+json',
        'Authorization': 'Bearer ' + token.access_token
      }
    });

    // console.log('User', response.data)
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          // Get token.
          const token = await getToken(email, password);
          // console.log('Token', token);
  
          // Get User ID.
          const user_id = await getUserId(token);
          // console.log('User ID', user_id);

          // Get User.
          const user = await getUser(user_id, token);
          // console.log('User', user);

          if (!user) return null;
          const emailMatch = user.data.attributes.mail === email;

          if (emailMatch) return user;
        }
  
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
