import React, { Component } from 'react';


import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';



class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }
    state = {
        purchasing: false,
        loading : false,
        error : false
    }

    componentDidMount (){
    /*    axios.get('/ingredients.json')
        .then(response =>{
            this.setState({ingredients : response.data});
        }).catch(error =>{
            this.setState({error:true});
        }) */
    };


    updatePurchaseState (ingredients) {
        const sum = Object.keys( ingredients )
            .map( igKey => {
                return ingredients[igKey];
            } )
            .reduce( ( sum, el ) => {
                return sum + el;
            }, 0 );
        return sum > 0 ;
    }

    

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
       
      this.props.history.push('/checkout');
    }

    render () {
        const disabledInfo = {
            ...this.props.ings
        };
        for ( let key in disabledInfo ) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
         // {salad: true, meat: false, ...}
        
        let modalSummary = null;

        let burger = this.state.error === true ? <p>Error retreiving Ingredients</p> : (<Spinner/>);

        if(this.props.ings){
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                    ingredientAdded={this.props.addIngredient}
                    ingredientRemoved={this.props.removeIngredient}
                    disabled={disabledInfo}
                    purchasable={this.updatePurchaseState(this.props.ings)}
                    ordered={this.purchaseHandler}
                    price={this.props.price} />
                </Aux>
                
            )

            modalSummary = (
                <OrderSummary 
                    ingredients={this.props.ings}
                    price={this.props.price}
                    purchaseCancelled={this.purchaseCancelHandler}
                    purchaseContinued={this.purchaseContinueHandler} />
            )
        }

        if (this.state.loading){
            modalSummary = (<Spinner/>);
        }

        
       
        return (
            <Aux>
                
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {modalSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = (state) =>{
    return {
        ings : state.ingredients,
        price : state.totalPrice
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addIngredient: (ingredientName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName:ingredientName}),
        removeIngredient: (ingredientName) => dispatch({type: actionTypes.DELETE_INGREDIENT, ingredientName:ingredientName})
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder,axios));