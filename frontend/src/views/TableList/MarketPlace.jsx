import React from "react";
// @material-ui/core components
import Input from "@material-ui/core/Input";
import { makeStyles, withStyles } from "@material-ui/core/styles";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Table from "../../components/Table/Table.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";
import PropTypes from "prop-types";
import { requestDEL, requestGET, requestPOST } from "../../requests";
import Dialog from "@material-ui/core/Dialog";
import { OutlinedInput } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputAdornment from "@material-ui/core/InputAdornment";
// import withStyles from "@material-ui/core/styles/withStyles";
import Swal from "sweetalert2";
import helpers from "../../utils.js";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Select from "@material-ui/core/Select/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const styles = {
    cardCategoryWhite: {
        "&,& a,& a:hover,& a:focus": {
            color: "rgba(255,255,255,.62)",
            margin: "0",
            fontSize: "14px",
            marginTop: "0",
            marginBottom: "0",
        },
        "& a,& a:hover,& a:focus": {
            color: "#FFFFFF",
        },
    },
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none",
        "& small": {
            color: "#777",
            fontSize: "65%",
            fontWeight: "400",
            lineHeight: "1",
        },
    },
    green: {
        color: "#259200",
    },
    red: {
        color: "#ac1a02",
    },
    stocksearchform: {
        margin: "20px",
        marginBottom: "0px",
    },
};

class MarketPlace extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shopColumnNames: [],
            shopValues: [],
            dayofWeek: null,
            category: null,
            itemColumnNames: [],
            itemValues: [],
            shopName: null,
            qty: 0,
        };

        this.dayOfWeekObject = {
            1: "Monday",
            2: "Tuesday",
            3: "Wednesday",
            4: "Thursday",
            5: "Friday",
            6: "Saturday",
            7: "Sunday",
        };
    }

    getAvailableShops = () => {
        requestGET("/shops/").then((res) => {
            if (res.data.length > 0) {
                let data = res.data;
                this.setState({
                    shopColumnNames: ["Shop Name"],
                    shopValues: data.map((x) => {
                        let category = x.category;
                        this.state.dayofWeek = x.dayOfWeek;
                        this.state.shopName = x.shopName;
                        x = Object.values(x);
                        x.push(this.enterShopFragment(category));
                        x.shift();
                        x.shift();
                        return x;
                    }),
                });
            } else {
                this.setState({
                    shopColumnNames: [],
                    shopValues: [],
                });
            }
        });
    };

    enterShop = (category) => {
        requestGET(`/shops/${this.state.dayofWeek}/${category}/items`)
            .then((res) => {
                if (res.data.length > 0) {
                    let data = res.data;
                    this.setState({
                        category: category,
                        itemColumnNames: Object.keys(data[0]),
                        itemValues: data.map((x) => {
                            let name = x.itemName;
                            x = Object.values(x);
                            x.push(this.purchaseFragment(name));
                            return x;
                        })
                    });
                } else {
                    let error = new Error()
                    error.response = {};
                    error.response.data = `Items couldn't be found for ${
                        this.dayOfWeekObject[this.state.dayofWeek]
                    }'s Market: ${category}`;
                    throw error;
                }
            })
            .catch((err) => {
                console.log(err)
                helpers.Toast.fire({
                    icon: "warning",
                    title: `${err.response.data}`,
                });
                this.setState({
                    category: null
                })
            });
    };

    enterShopFragment = (category) => (
        <React.Fragment>
            <Button
                variant="contained"
                color="success"
                onClick={() => {
                    this.enterShop(category);
                }}
            >
                Enter Shop
            </Button>
        </React.Fragment>
    );

    buyItem = (name) => {
        requestPOST(
            `/shops/${this.state.dayofWeek}/${this.state.category}/items/${name}/purchase`,
            { amount: this.state.qty }
        )
            .then((res) => {
                helpers.Toast.fire({
                    icon: "success",
                    title: `Bought ${this.state.qty} of ${name}!`,
                });
                this.props.handleGetAccountsInfo();
            })
            .then(() => {
                this.enterShop(this.state.category);
            })
            .catch((err) => {
                helpers.Toast.fire({
                    icon: "warning",
                    title: `${err.response.data}`,
                });
                this.enterShop(this.state.category);
            });
    };

    purchaseFragment = (name) => (
        <React.Fragment>
            <div class="form-inline">
                <OutlinedInput
                    type="number"
                    size="small"
                    endAdornment={
                        <InputAdornment position="end">QTY</InputAdornment>
                    }
                    InputProps={{ inputProps: { min: 0 } }}
                    required
                    defaultValue={0}
                    // value={this.state.qty}
                    onChange={(e) => {
                        this.setState({ qty: e.target.value });
                    }}
                />

                <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                        this.buyItem(name);
                    }}
                >
                    Buy
                </Button>
            </div>
        </React.Fragment>
    );

    componentDidMount() {
        this.getAvailableShops();
    }

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        {this.state.category == null ?
                            <Card>
                                <CardHeader color="primary">
                                    <h4 className={classes.cardTitleWhite}>Shop</h4>
                                    <p className={classes.cardCategoryWhite}>
                                    </p>
                                </CardHeader>
                                <CardBody>
                                    <Table
                                        tableHeaderColor="primary"
                                        tableHead={this.state.shopColumnNames}
                                        tableData={this.state.shopValues}
                                    />
                                </CardBody>
                            </Card>
                            :
                            <Card>
                                <CardHeader color="primary">
                                    <h4 className={classes.cardTitleWhite}>Items</h4>
                                    <p className={classes.cardCategoryWhite}>
                                    </p>
                                </CardHeader>
                                <CardBody>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        className={classes.button}
                                        startIcon={<ArrowBackIcon/>}
                                        onClick={() => {this.setState({category: null})}}
                                    >
                                        Back to Shop Select
                                    </Button>
                                    <Table
                                        fixedHeader={false}
                                        style={{width: "auto", tableLayout: "auto"}}
                                        tableHeaderColor="primary"
                                        tableHead={this.state.itemColumnNames}
                                        tableData={this.state.itemValues}
                                    />
                                </CardBody>
                            </Card>
                        }
                    </GridItem>
                </GridContainer>
            </React.Fragment>
        );
    }
}

MarketPlace.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MarketPlace);
