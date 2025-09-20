import { Menu } from "antd";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const handleClick = (e) => {
    console.log('click ', e);
    const item = items.find((i) => i.key === e.key);
    if (item && item.href) {
      navigate(item.href);
    }
  };
  return (
    <Menu
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={['0']}
      items={items}
      onClick={handleClick}
      style={{ flex: 1, minWidth: 0 }}
    />
  )
}


export default NavBar;
