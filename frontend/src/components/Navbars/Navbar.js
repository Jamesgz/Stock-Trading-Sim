import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
// core components
import AdminNavbarLinks from "./AdminNavbarLinks.js";
import Button from "../../components/CustomButtons/Button.js";

import styles from "../../assets/jss/material-dashboard-react/components/headerStyle.js";
import DashboardPage from "../../views/Dashboard/Dashboard";
import UserProfile from "../../views/UserProfile/UserProfile";
import TableList from "../../views/TableList/TableList";

const useStyles = makeStyles(styles);

const topBarArray = [
  {
    path: "/stocks",
    name: "My Stocks",
    component: DashboardPage,
    layout: "/user"
  },
  {
    path: "/items",
    name: "My Items",
    component: UserProfile,
    layout: "/user"
  },
  {
    path: "/history",
    name: "History",
    component: TableList,
    layout: "/user"
  },
];

export default function Header(props, {...rest}) {
  const classes = useStyles();
  const topBarComponents = (
      <React.Fragment>
        {topBarArray.map((item, key) => {
          return (
              <div className={classes.padded}>
                <Button variant="contained" color="primary" onClick={
                  () => {props.history.push(item.layout+item.path)}
                }>
                  {item.name}
                </Button>
              </div>
          )
        })}
      </React.Fragment>
  )

  const { color } = props;
  const appBarClasses = classNames({
    [" " + classes[color]]: color
  });
  // console.log(props);
  return (
    <AppBar className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.container}>
        <div className={classes.flex}>
          {/* Here we create navbar brand, based on route name */}
          <Button color="transparent" href="#" className={classes.title}>
            {/*{makeBrand()}*/}
          </Button>
        </div>
        {topBarComponents}
        {/*<div className={classes.padded}>*/}
        {/*  <Button variant="contained" color="primary">*/}
        {/*    My Stocks*/}
        {/*  </Button>*/}
        {/*</div>*/}
        {/*<div className={classes.padded}>*/}
        {/*  <Button variant="contained" color="primary">*/}
        {/*    My Items*/}
        {/*  </Button>*/}
        {/*</div>*/}
        {/*<div className={classes.padded}>*/}
        {/*  <Button variant="contained" color="primary">*/}
        {/*    History*/}
        {/*  </Button>*/}
        {/*</div>*/}
        {/*<div className={classes.padded}>*/}
        {/*  <Button variant="contained" color="primary">*/}
        {/*    Current Money*/}
        {/*  </Button>*/}
        {/*</div>*/}
        {/*<div className={classes.padded}>*/}
        {/*  <Button variant="contained" color="primary">*/}
        {/*    Change Player (TBD)*/}
        {/*  </Button>*/}
        {/*</div>*/}
        <Hidden smDown implementation="css">
         <AdminNavbarLinks {...props}/>
        </Hidden>
        <Hidden mdUp implementation="css">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={props.handleDrawerToggle}
          >
            <Menu />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
  handleDrawerToggle: PropTypes.func,
  routes: PropTypes.arrayOf(PropTypes.object)
};
