import { Menu } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useViewNavigation from "../navigation";

const getItems = (searchParams) => {
  const paramStr = (searchParams.toString() ? `?${searchParams.toString()}` : '')
  return [
    {
      label: 'Home',
      key: 'home',
      href: '/' + paramStr
    },
    {
      label: 'Things',
      key: 'things',
      href: '/things' + paramStr
    },
    {
      label: 'Tickets',
      key: 'tickets',
      href: '/tickets' + paramStr
    },
    {
      label: 'Milestones',
      key: 'milestones',
      href: '/milestones' + paramStr
    },
    {
      label: 'Schedules',
      key: 'schedules',
      href: '/schedules' + paramStr
    },
    {
      label: 'Users',
      key: 'users',
      href: '/users' + paramStr
    }
  ]
}



const NavBar = () => {
  const navigation = useViewNavigation();
  const items = getItems(navigation.searchParams);
  const [selectedKey, setSelectedKey] = useState('home');

  // Effect to update highlight on location change
  useEffect(() => {
    // find the first item that matches the start of the pathname
    // start by stripping leading slash
    const location = navigation.location;
    const strippedPath = location.pathname.startsWith('/') ? location.pathname.slice(1) : location.pathname;

    const matchingItem = items.find((i) =>
      strippedPath.startsWith(i.key));
    setSelectedKey(matchingItem ? matchingItem.key : 'home'); // Fallback to 'home'
  }, [navigation.location.pathname]); // Depend on pathname changes

  // clickhandler
  const handleClick = (e) => {
    const item = items.find((i) => i.key === e.key);
    if (item && item.href) {
      navigation.navigate(item.href);
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
