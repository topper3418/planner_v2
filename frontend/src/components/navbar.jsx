import { Menu } from "antd";
import { useState } from "react";
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
  const handleClick = (e) => {
    console.log('click ', e);
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
