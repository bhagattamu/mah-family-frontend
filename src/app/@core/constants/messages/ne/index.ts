import { ProjectModuleMessagesNE } from './project.constant';
import { UserModuleMessagesNE } from './user.constant';

export const NEMessage = { ...UserModuleMessagesNE, ...ProjectModuleMessagesNE };
