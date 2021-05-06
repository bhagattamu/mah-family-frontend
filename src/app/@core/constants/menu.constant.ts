import { NbMenuItem } from '@nebular/theme';

export interface MenuItem extends NbMenuItem {
    key?: string;
    children?: MenuItem[];
    parent?: MenuItem;
}

export const MENU_KEY = {
    LOGIN: 'LOGIN',
    REGISTER: 'REGISTER',
    PROFILE: 'PROFILE',
    MESSAGES: 'MESSAGES',
    NOTIFICATIONS: 'NOTIFICATIONS',
    CHANGE_PASSWORD: 'CHANGE_PASSWORD',
    LOGOUT: 'LOGOUT',
    LANGUAGES: 'LANGUAGES',
    ABOUT_US: 'ABOUT_US',
    CONTACT: 'CONTACT',
    ADMIN: 'ADMIN',
    DASHBOARD: 'DASHBOARD',
    MANAGE_USER: 'MANAGE_USER',
    PROJECT: 'PROJECT',
    PROJECT_WITHOUT_CHILD: 'PROJECT_WITHOUT_CHILD',
    MANAGE: 'MANAGE',
    PROJECT_DETAIL: 'PROJECT_DETAIL',
    SUBJECT: 'SUBJECT',
    FAMILY_TREE: 'FAMILY_TREE',
    FAMILY_TIMELINE: 'FAMILY_TIMELINE'
};

const ENGLISH_TITLE = {
    [MENU_KEY.LOGIN]: 'Login',
    [MENU_KEY.REGISTER]: 'Register',
    [MENU_KEY.PROFILE]: 'Profile',
    [MENU_KEY.MESSAGES]: 'Messages',
    [MENU_KEY.NOTIFICATIONS]: 'Notifications',
    [MENU_KEY.CHANGE_PASSWORD]: 'Change Password',
    [MENU_KEY.LOGOUT]: 'Logout',
    [MENU_KEY.LANGUAGES]: 'Languages',
    [MENU_KEY.ABOUT_US]: 'About Us',
    [MENU_KEY.CONTACT]: 'Contact',
    [MENU_KEY.ADMIN]: 'Admin',
    [MENU_KEY.DASHBOARD]: 'Dashboard',
    [MENU_KEY.MANAGE_USER]: 'Manage User',
    [MENU_KEY.PROJECT]: 'Project',
    [MENU_KEY.PROJECT_WITHOUT_CHILD]: 'Project',
    [MENU_KEY.MANAGE]: 'Manage',
    [MENU_KEY.PROJECT_DETAIL]: 'Detail',
    [MENU_KEY.SUBJECT]: 'Subject',
    [MENU_KEY.FAMILY_TREE]: 'Family Tree',
    [MENU_KEY.FAMILY_TIMELINE]: 'Family Timeline'
};

const NEPALI_TITLE = {
    [MENU_KEY.LOGIN]: 'लग - इन',
    [MENU_KEY.REGISTER]: 'रेजिष्टर गर्नुहोस्',
    [MENU_KEY.PROFILE]: 'प्रोफाइल',
    [MENU_KEY.MESSAGES]: 'सन्देशहरू',
    [MENU_KEY.NOTIFICATIONS]: 'सूचनाहरू',
    [MENU_KEY.CHANGE_PASSWORD]: 'पासवर्ड परिवर्तन गर्नुहोस्',
    [MENU_KEY.LOGOUT]: 'बाहिर निस्कनु',
    [MENU_KEY.LANGUAGES]: 'भाषाहरु',
    [MENU_KEY.ABOUT_US]: 'हाम्रोबारे',
    [MENU_KEY.CONTACT]: 'सम्पर्क',
    [MENU_KEY.ADMIN]: 'प्रशासन',
    [MENU_KEY.DASHBOARD]: 'ड्यासबोर्ड',
    [MENU_KEY.MANAGE_USER]: 'प्रयोगकर्ता प्रबन्ध गर्नुहोस्',
    [MENU_KEY.PROJECT]: 'प्रोजेक्ट',
    [MENU_KEY.PROJECT_WITHOUT_CHILD]: 'प्रोजेक्ट',
    [MENU_KEY.MANAGE]: 'प्रबन्ध गर्नुहोस्',
    [MENU_KEY.PROJECT_DETAIL]: 'विवरण',
    [MENU_KEY.SUBJECT]: 'व्यक्ति',
    [MENU_KEY.FAMILY_TREE]: 'वंश नक्शा',
    [MENU_KEY.FAMILY_TIMELINE]: 'परिवार समयरेखा'
};

export const validProjectLink = {
    [MENU_KEY.SUBJECT]: `/project/subject/{{projectId}}`,
    [MENU_KEY.FAMILY_TREE]: `/project/family-tree/{{projectId}}`,
    [MENU_KEY.FAMILY_TIMELINE]: `/project/timeline-project/{{projectId}}`
};

export const getTranslatedTitle = (lang: string, key: string) => {
    if (lang.toUpperCase() === 'EN') {
        return ENGLISH_TITLE[key] ?? key;
    } else if (lang.toUpperCase() === 'NE') {
        return NEPALI_TITLE[key] ?? key;
    } else {
        return key;
    }
};

export const menuWhenNotLogin: MenuItem[] = [
    {
        title: 'Login',
        pathMatch: 'full',
        key: MENU_KEY.LOGIN
    },
    {
        title: 'Register',
        pathMatch: 'full',
        key: MENU_KEY.REGISTER
    }
];

export const menuWhenLoggedIn: MenuItem[] = [
    {
        title: 'Profile',
        key: MENU_KEY.PROFILE
    },
    {
        title: 'Messages',
        badge: {
            text: '3',
            status: 'danger'
        },
        key: MENU_KEY.MESSAGES
    },
    {
        title: 'Notifications',
        badge: {
            text: '3',
            status: 'info'
        },
        key: MENU_KEY.NOTIFICATIONS
    },
    {
        title: 'Change Password',
        key: MENU_KEY.CHANGE_PASSWORD
    },
    {
        title: 'Logout',
        key: MENU_KEY.LOGOUT
    }
];

export const sideNavMenus: MenuItem[] = [
    {
        title: 'Languages',
        link: '/language',
        key: MENU_KEY.LANGUAGES
    },
    {
        title: 'About Us',
        hidden: true,
        key: MENU_KEY.ABOUT_US
    },
    {
        title: 'Contact',
        hidden: true,
        key: MENU_KEY.CONTACT
    }
];

export const adminMenus: Array<MenuItem> = [
    {
        title: 'Admin',
        icon: 'shield-outline',
        key: MENU_KEY.ADMIN,
        hidden: true,
        children: [
            {
                title: 'Dashboard',
                link: '/admin',
                pathMatch: 'full',
                icon: 'home-outline',
                key: MENU_KEY.DASHBOARD
            },
            {
                title: 'Manage User',
                link: '/admin/manage-user',
                pathMatch: 'prefix',
                icon: 'settings-outline',
                key: MENU_KEY.MANAGE_USER
            }
        ]
    }
];

export const projectMenus: Array<MenuItem> = [
    {
        title: 'Project',
        icon: 'folder-outline',
        link: `/project`,
        hidden: true,
        key: MENU_KEY.PROJECT_WITHOUT_CHILD
    },
    {
        title: 'Project',
        icon: 'folder-outline',
        expanded: true,
        hidden: true,
        key: MENU_KEY.PROJECT,
        children: [
            {
                title: 'Manage',
                link: `/project`,
                icon: 'briefcase-outline',
                pathMatch: 'full',
                key: MENU_KEY.MANAGE
            },
            {
                title: 'Detail',
                link: `/project/{{projectId}}`,
                icon: 'book-open-outline',
                pathMatch: 'prefix',
                key: MENU_KEY.PROJECT_DETAIL
            },
            {
                title: 'Subject',
                link: `/project/subject/{{projectId}}`,
                icon: 'person-outline',
                pathMatch: 'prefix',
                key: MENU_KEY.SUBJECT
            },
            {
                title: 'Family Tree',
                link: `/project/family-tree/{{projectId}}`,
                icon: 'arrowhead-up-outline',
                pathMatch: 'prefix',
                key: MENU_KEY.FAMILY_TREE
            },
            {
                title: 'Family Timeline',
                link: `/project/timeline-project/{{projectId}}`,
                icon: 'clock-outline',
                pathMatch: 'prefix',
                key: MENU_KEY.FAMILY_TIMELINE
            }
        ]
    }
];

export const commonMenus: Array<MenuItem> = [
    {
        title: 'About Us',
        link: '/about',
        icon: 'people-outline',
        key: MENU_KEY.ABOUT_US
    },
    {
        title: 'Contact Us',
        link: '/contact-us',
        icon: 'phone-outline',
        key: MENU_KEY.CONTACT
    }
];
