import { NavLink } from '@mantine/core';
import { useNavigate } from 'react-router';

export interface MenuItem {
  label: string;
  leftIcon?: any;
  path: string;
  roles?: string[];
  children?: MenuItem[];
}

interface MenuItemsProps {
  items: MenuItem[];
  userRoles: string[]; // Current user's roles
}

const MenuItems = ({ items, userRoles }: MenuItemsProps) => {
  const navigate = useNavigate();

  const hasAccess = (roles?: string[]) => {
    // If no roles are specified, item is public
    if (!roles) return true;
    // Check if any of the user's roles match the item's roles
    return roles.some((role) => userRoles.includes(role));
  };

  const renderMenuItems = (menuItems: MenuItem[]) => {
    return menuItems
      .filter((item) => hasAccess(item.roles)) // Filter items based on access
      .map((item, index) => (
        <NavLink
          key={index}
          label={item.label}
          leftSection={item.leftIcon && <item.leftIcon />}
          onClick={
            !item.children // Only navigate if there are no children
              ? () => navigate(item.path)
              : undefined // Disable navigation for parents
          }
          aria-current={
            item.path === window.location.pathname ||
            item.children?.some((val) => val.path === window.location.pathname)
              ? 'page'
              : undefined
          }
          className='mb-1 rounded-lg'
        >
          {item.children && renderMenuItems(item.children)}
        </NavLink>
      ));
  };

  return <>{renderMenuItems(items)}</>;
};

export default MenuItems;
