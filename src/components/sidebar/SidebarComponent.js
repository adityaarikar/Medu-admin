import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { useHistory } from 'react-router-dom';
import SLUGS from 'resources/slugs';
import { convertSlugToUrl } from 'resources/utilities';
import LogoComponent from './LogoComponent';
import Menu from './MenuComponent';
import MenuItem from './MenuItemComponent';
import { MdSubject, MdTopic, MdHome, MdLogout, MdMenuBook, MdLock } from 'react-icons/md';

const useStyles = createUseStyles({
    separator: {
        borderTop: ({ theme }) => `1px solid ${theme.color.lightGrayishBlue}`,
        marginTop: 16,
        marginBottom: 16,
        opacity: 0.06
    }
});

function SidebarComponent() {
    const { push } = useHistory();
    const theme = useTheme();
    const classes = useStyles({ theme });
    const isMobile = window.innerWidth <= 1080;

    async function logout() {
        push(SLUGS.login);
    }

    function onClick(slug, parameters = {}) {
        push(convertSlugToUrl(slug, parameters));
    }

    return (
        <Menu isMobile={isMobile}>
            <div style={{ paddingTop: 30, paddingBottom: 30 }}>
                <LogoComponent />
            </div>
            <MenuItem
                id={SLUGS.home}
                title='Dashboard'
                icon={MdHome}
                onClick={() => onClick(SLUGS.home)}
            ></MenuItem>
            <div className={classes.separator}></div>
            <MenuItem
                id={SLUGS.subjects}
                title='Subjects'
                icon={MdSubject}
                onClick={() => onClick(SLUGS.subjects)}
            ></MenuItem>
            <div className={classes.separator}></div>
            <MenuItem
                id={SLUGS.chapters}
                title='Chapters'
                icon={MdMenuBook}
                onClick={() => onClick(SLUGS.chapters)}
            ></MenuItem>
            <div className={classes.separator}></div>
            <MenuItem
                id={SLUGS.topics}
                title='Topics'
                icon={MdTopic}
                onClick={() => onClick(SLUGS.topics)}
            ></MenuItem>
            <div className={classes.separator}></div>
            <MenuItem id='privacy' title='Privacy' icon={MdLock} onClick={SLUGS.privacy} />
            <MenuItem id='logout' title='Logout' icon={MdLogout} onClick={logout} />
        </Menu>
    );
}

export default SidebarComponent;
