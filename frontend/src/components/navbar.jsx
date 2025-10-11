import { Menu } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const items = [
  {
    label: 'Home',
    key: 'home',
    href: '/'
  },
  {
    label: 'Things',
    key: 'things',
    href: '/things'
  }
]



const NavBar = () => {
  const location = useLocation();
  const item = items.find((i) => i.href === location.pathname);
  const [selectedKey, setSelectedKey] = useState(item ? item.key : 'home');
  const navigate = useNavigate();

  // Effect to update highlight on location change
  useEffect(() => {
    // first rank order the items by length of href descending
    const sortedItems = items.slice().sort((a, b) => b.href.length - a.href.length);
    // then find the first item that matches the start of the pathname
    const matchingItem = sortedItems.find((i) => location.pathname.startsWith(i.href));
    setSelectedKey(matchingItem ? matchingItem.key : 'home'); // Fallback to 'home'
  }, [location.pathname]); // Depend on pathname changes

  const handleClick = (e) => {
    const item = items.find((i) => i.key === e.key);
    if (item && item.href) {
      navigate(item.href);
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
