import React, {Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/Form/Input';

import {connect} from "react-redux";

class ContactData extends Component {
    state = {
        orderForm : {
        name:{
            elementType : 'input',
            elementConfig:{
                type :'text',
                placeholder: 'Your Name'
            },
            value:'',
            validation : {
                required : true,
            },
            isValid:false,
            edited:false
        },
        address : {
            elementType : 'input',
            elementConfig:{
                type :'text',
                placeholder: 'Your Address'
            },
            value:'',
            validation : {
                required : true,
                min : 9,
                max: 9
            },
            isValid:false,
            edited:false
        },
        email : {
            elementType : 'input',
            elementConfig:{
                type :'email',
                placeholder: 'Your Email'
            },
            value:'',
            validation : {
                required : true
            },
            isValid:false,
            edited:false
        },
        deliveryMethod : {
            elementType : 'select',
            elementConfig:{
                options : [{value : 'fastest' , displayValue : 'Fastest'}, {value : 'cheapest' , displayValue : 'Cheapest'} ]
            },
            value:'fastest',
            isValid:true
        }
        },
        isFormValid:false,
        loading : false
    };

    onChangeHandler = (event , id) =>{
        const updatedForm = {...this.state.orderForm};
        const updatedFormElement = {...updatedForm[id]};
        updatedFormElement.value = event.target.value;
        updatedFormElement.edited = true;
        updatedFormElement.isValid = this.isValid(updatedFormElement.validation,event.target.value);
        updatedForm[id] = updatedFormElement;
        let formValid = this.isFormValid(updatedForm);
        this.setState({orderForm : updatedForm , isFormValid : formValid});
    }

    isFormValid = (formCopy)=>{
        let formValid = true;
        for (let key in formCopy){
            formValid = formCopy[key].isValid && formValid;
        };
        return formValid;
    }

    isValid = (rules , value) =>{
        if (rules == null){
            return true;
        }
        let valid = true;
        if (rules.required){
            valid = value.trim() !== "" && valid;
        }

        if (rules.min){
            valid = value.length >= rules.min && valid;
        }

        if (rules.max){
            valid = value.length <= rules.max && valid;
        }
        return valid;
    }

    orderHandler = (event) =>{
        event.preventDefault();
        this.setState({loading : true});
        let formDetails = {};

        for (let key in this.state.orderForm){
            formDetails[key] = this.state.orderForm[key].value;
        };
       const object = {
           ingredients : this.props.ingredients,
           price : this.props.price,
           info : formDetails
       };

       axios.post('/orders.json' , object)
       .then(response =>{
           console.log(response);
           this.setState({
               loading : false,
           });
           this.props.history.push("/");
       }).catch(error =>{
           console.log(error)
           this.setState({
            loading : false,
           
        });
       });
       
    };

    render (){

        let inputElementArray = [];

        for (let key in this.state.orderForm){
            inputElementArray.push({
                id : key,
                config : this.state.orderForm[key]
            });
        };


        let form =(
        <form onSubmit={this.orderHandler}>
            {inputElementArray.map((inputElement)=>{
                return <Input key={inputElement.id} elementtype={inputElement.config.elementType} elementconfig={inputElement.config.elementConfig} value={inputElement.config.value} invalid={!inputElement.config.isValid} edited={inputElement.config.edited} changed={(event)=> this.onChangeHandler(event, inputElement.id)}></Input>
            })}
            <Button btnType='Success' disabled = {!this.state.isFormValid}>Order</Button>
        </form>);
        
        if (this.state.loading){
            form = (<Spinner/>)
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter Contact Data</h4>
                {form}
            </div>
        );
    }
};

const mapStateToProps = (state)=>{
    return {
        ingredients: state.ingredients,
        price: state.totalPrice
    }
}

export default connect(mapStateToProps)(ContactData);