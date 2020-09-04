import { User } from '../store/auth/types';
import defaultUserImage from '../assets/images/default-user.svg';

export const fallbackUser: User = {
  displayName: 'Anonymous',
  email: 'anonymous@anonymous.com',
  id: '0',
  photoUrl: defaultUserImage,
};
