import React, {Component} from 'react';
import Modal from '../../components/UI/Modal/Modal';

const withErrorHandler = (WrappedComponent,axios)=>{
    return class extends Component {

        constructor (props) {
            super(props);
            this.state = {
                error : null
            };
            this.reqInterceptor=axios.interceptors.request.use(req => {
                this.setState({error: null});
                return req;
            });
            this.resInterceptor=axios.interceptors.response.use(res => res, err => {
                console.log(err);
                this.setState({error:err});
            });
        }

        componentWillUnmount(){
            console.log("Unmount intercepetor value" + this.reqInterceptor + this.resInterceptor);
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.resInterceptor);
        }

        errorConfirmedHandler = () =>{
            this.setState({error:null});
        }
        
        render (){

            return(
                <div>
                    <Modal show={this.state.error} modalClosed={this.errorConfirmedHandler}>
                        {this.state.error ? this.state.error.message: null}
                    </Modal>
                    <WrappedComponent {...this.props}/>
                </div>
                    
                
            );
        }
    }
}

export default withErrorHandler;