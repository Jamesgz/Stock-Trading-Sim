import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import {makeStyles, withStyles} from "@material-ui/core/styles";
// core components
import Navbar from "../components/Navbars/Navbar.js";
// import Footer from "../components/Footer/Footer.js";
import Sidebar from "../components/Sidebar/Sidebar.js";
// import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

import routes from "../routes.js";

import styles from "../assets/jss/material-dashboard-react/layouts/adminStyle.js";

import bgImage from "../assets/img/sidebar-2.jpg";
import logo from "../assets/img/reactlogo.png";
import {requestGET} from "../requests";
import PropTypes from "prop-types";

class Admin extends React.Component {
    constructor(props) {
        super(props)
        this.mainPanel = React.createRef();
        this.ps = null;
        this.image = bgImage;
        this.color = "blue";
        this.state = {
            mobileOpen: false,
            players: [],
            currentPlayer: null,
            admin: false,
        }

    }

    getRoute = () => {
        console.log(window.location.pathname);
        return window.location.pathname !== "/user/maps";
    };

    resizeFunction = () => {
        if (window.innerWidth >= 960) {
            this.setState({
                mobileOpen: false
            })
        }
    };

    handleDrawerToggle = () => {
        this.setState({
            mobileOpen: !this.state.mobileOpen
        })
    };

    handleGetAccountsInfo = () => {
        requestGET("/accounts/players")
            .then((res) => {
                console.log(res.data);
                if(res.data.length > 0)   {
                    this.setState({
                        players: res.data,
                        currentPlayer: res.data[0]
                    })
                    return res.data[0]
                }
                return null;
            })
            .then((player) => {
                if (player) {
                    return requestGET(`/accounts/players/${player.playerId}` )
                }
                return Promise.resolve(null);
            })
            .then((player) => {
                if (player) {
                    return requestGET(`/accounts/admin`)
                }
                return Promise.resolve(null);
            })
            .then((res) => {
                if (res && res.data.length > 0) {
                    this.setState({
                        admin: true
                    })
                }
            })
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        // this.handleGetAccountsInfo(); //might be too many queries if we do this
    }

    componentDidMount() {
        if (navigator.platform.indexOf("Win") > -1) {
            this.ps = new PerfectScrollbar(this.mainPanel.current, {
                suppressScrollX: true,
                suppressScrollY: false
            });
            document.body.style.overflow = "hidden";
        }
        window.addEventListener("resize", this.resizeFunction);
        this.handleGetAccountsInfo();
    }

    componentWillUnmount() {
        if (navigator.platform.indexOf("Win") > -1) {
            this.ps.destroy();
        }
        window.removeEventListener("resize", this.resizeFunction);
    }

    render() {
        const {classes} = this.props;
        this.filteredRoutes = routes.filter((x) => {
            if (x.icon == null) return false;

            if (x.type === "admin" && this.state.admin === false) return false;
            if (x.type === "admin" && this.state.admin === true) return true;

            return true;
        });
        this.switchRoutes = (
            <Switch>
                {routes.map((prop, key) => {
                    // console.log(prop);
                    if ((prop.type === "admin" && this.state.admin === true) || prop.type === "user") {
                        console.log(`rendering: ${prop.path}`);
                        return (
                            <Route
                                path={prop.layout + prop.path}
                                // component={prop.component}
                                render={() => {
                                    let Element = prop.component;
                                    return <Element {...this.props} {...this.state}/>;
                                }}
                                key={key}
                            />
                        );
                    }
                    return null;
                })}
                <Redirect from="/user" to="/user/dashboard" />
            </Switch>
        );
        return (
            <div className={classes.wrapper}>
                <Sidebar
                    routes={this.filteredRoutes}
                    logo={logo}
                    image={this.image}
                    handleDrawerToggle={this.handleDrawerToggle}
                    open={this.state.mobileOpen}
                    color={this.color}
                    {...this.props} {...this.state}
                />
                <div className={classes.mainPanel} ref={this.mainPanel}>
                    <Navbar
                        routes={this.filteredRoutes}
                        handleDrawerToggle={this.handleDrawerToggle}
                        {...this.props} {...this.state}
                    />
                    {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
                    {this.getRoute() ? (
                        <div className={classes.content}>
                            <div className={classes.container}>{this.switchRoutes}</div>
                        </div>
                    ) : (
                        <div className={classes.map}>{this.switchRoutes}</div>
                    )}
                </div>
            </div>
        );
    }
}


Admin.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Admin);