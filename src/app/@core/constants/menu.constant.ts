import { NbMenuItem } from '@nebular/theme';

export const menuWhenNotLogin: NbMenuItem[] = [
    {
        title: 'Login',
        pathMatch: 'full'
    },
    {
        title: 'Register',
        pathMatch: 'full'
    }
];

export const menuWhenLoggedIn: NbMenuItem[] = [
    {
        title: 'Profile'
    },
    {
        title: 'Messages',
        badge: {
            text: '3',
            status: 'danger'
        }
    },
    {
        title: 'Notifications',
        badge: {
            text: '3',
            status: 'info'
        }
    },
    {
        title: 'Change Password'
    },
    {
        title: 'Logout'
    }
];

export const sideNavMenus: NbMenuItem[] = [
    {
        title: 'Languages',
        link: '/language'
    },
    {
        title: 'About Us',
        hidden: true
    },
    {
        title: 'Contact',
        hidden: true
    }
];

export const adminMenus: Array<NbMenuItem> = [
    {
        title: 'Admin',
        children: [
            {
                title: 'Dashboard',
                link: '/admin'
            },
            {
                title: 'Manage User',
                link: '/admin/manage-user'
            }
        ]
    }
];
