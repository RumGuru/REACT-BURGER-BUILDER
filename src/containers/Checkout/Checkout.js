import React, {Component} from 'react';
import { Route } from 'react-router-dom';
import {connect} from 'react-redux';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {
    
    
    checkoutCancel = () =>{
        this.props.history.goBack();
    };

    checkoutContinue = () =>{
        this.props.history.replace('/checkout/contact-data');
    }
    render () {
        return (
            <div>
                <CheckoutSummary ingredients = {this.props.ing} checkoutCancel={this.checkoutCancel} checkoutContinue={this.checkoutContinue}></CheckoutSummary>
                <Route path={this.props.match.path + "/contact-data"} component={ContactData}></Route>
            </div>
        );
    }
};

const mapStateToProps = (state)=>{
    return{
        ing: state.ingredients
    }
}
export default connect(mapStateToProps)(Checkout);

