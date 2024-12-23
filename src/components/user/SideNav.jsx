import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";
import useMenuStore from "../../store/menu-store";
import { useEffect } from "react";

const SideNav = () => {
  const { fetchMenuCategories, categories } = useMenuStore();
  const location = useLocation();

  useEffect(() => {
    fetchMenuCategories();
  }, []);

  return (
    <Sidebar>
      <Menu>
        {categories.map((category) => {
          const categoryPath = `/menu/${category.name
            .replace(/\s+/g, "-")
            .toLowerCase()}`;
          const isActive = location.pathname === categoryPath;

          return (
            <MenuItem
              key={category._id}
              component={<Link to={categoryPath} />}
              style={{
                textTransform: "capitalize",
                backgroundColor: isActive ? "#1d2d44" : "#fff",
                color: isActive ? "#ffc300" : "inherit",
                fontWeight: "500",
              }}
            >
              {category.name}
            </MenuItem>
          );
        })}
      </Menu>
    </Sidebar>
  );
};

export default SideNav;
