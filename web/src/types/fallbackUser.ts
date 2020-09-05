import { User } from '../store/auth/types';
import defaultUserImage from '../assets/images/default-user.png';

export const fallbackUser: User = {
  displayName: 'Anonymous',
  email: '',
  id: '',
  photoUrl: defaultUserImage,
  token: null,
};
