import React from 'react';
import classes from './Input.css';

const input = (props) => {
    let inputElement = null;
    let style = [classes.InputElement];

    if (props.invalid && props.edited) {
        style.push(classes.InvalidStyling);
    }

    switch(props.elementtype) {
        case ('input') : inputElement = <input className={style.join(' ')} {...props.elementconfig} value={props.value} onChange={props.changed}/>;
        break;
        case ('textArea') : inputElement = <textarea className={style.join(' ')} {...props} value={props.value} onChange={props.changed}/>;
        break;
        case ('select') : inputElement = (
            <select className={style.join(' ')} value={props.value} onChange={props.changed}>{props.elementconfig.options.map((el)=>{
                return <option key={el.value} value={el.value}>{el.displayValue}</option>
            })}</select>
        );
        break;
        default : inputElement = <input className={style.join(' ')} {...props} value={props.value} onChange={props.changed}/>

    }
return(
<div className={classes.Input}>
    <label className={classes.Label}>{props.label}</label>
    {inputElement}
</div> 

);
}

export default input;