import { Menu } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useViewNavigation from "../navigation";

const getItems = (searchParams) => {
  return [
    {
      label: 'Home',
      key: 'home',
      href: '/' + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    },
    {
      label: 'Tickets',
      key: 'tickets',
      href: '/tickets' + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    },
    {
      label: 'Milestones',
      key: 'milestones',
      href: '/milestones' + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    },
    {
      label: 'Users',
      key: 'users',
      href: '/users' + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    }
  ]
}



const NavBar = () => {
  const navigation = useViewNavigation();
  const items = getItems(navigation.searchParams);
  const item = items.find((i) => navigation.location.pathname.startsWith(i.href));
  const [selectedKey, setSelectedKey] = useState(item ? item.key : 'home');

  // Effect to update highlight on location change
  useEffect(() => {
    // first rank order the items by length of href descending
    const sortedItems = items.slice().sort((a, b) =>
      b.href.length - a.href.length);
    // then find the first item that matches the start of the pathname
    const matchingItem = sortedItems.find((i) =>
      location.pathname.startsWith(i.href));
    setSelectedKey(matchingItem ? matchingItem.key : 'home'); // Fallback to 'home'
  }, [navigation.location.pathname]); // Depend on pathname changes

  // clickhandler
  const handleClick = (e) => {
    const item = items.find((i) => i.key === e.key);
    if (item && item.href) {
      navigation.navigate(item.href);
      setSelectedKey(e.key);
    }
  };

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[selectedKey]}
      items={items}
      onClick={handleClick}
      style={{ flex: 1, minWidth: 0 }}
    />
  )
}


export default NavBar;
