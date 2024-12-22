import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";

const OrdersSideNav = () => {
  const location = useLocation();

  const status = ["Confirmed", "Preparing", "In Transit", "Completed"];
  const currentStatus = new URLSearchParams(location.search).get("status");

  return (
    <Sidebar>
      <Menu>
        {status.map((status, index) => {
          const statusQuery = `?status=${status}`;
          const isActive = currentStatus === status;

          return (
            <MenuItem
              key={index}
              component={
                <Link to={`/honey-brew-client/#/admin/orders${statusQuery}`} />
              }
              style={{
                textTransform: "capitalize",
                backgroundColor: isActive ? "#1d2d44" : "#fff",
                color: isActive ? "#ffc300" : "inherit",
                fontWeight: "500",
              }}
            >
              {status}
            </MenuItem>
          );
        })}
      </Menu>
    </Sidebar>
  );
};

export default OrdersSideNav;
