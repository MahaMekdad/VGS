import React, { Component } from "react";
import Logout from "../Logout";
import {connect} from "react-redux";
import {Enum_userType} from '../../Enums/Enums'
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import {Enum_appStatus} from '../../Enums/Enums'
//import Faq from "../Faq";

export class Navbar extends Component {


  getAppStatusValue = (value)=>{
    return "App Status : "+ Enum_appStatus.getKey(value)
 }

 isAllowedUserType(){
  if((this.props.usrType === Enum_userType.President.value || 
     this.props.usrType ===  Enum_userType.Director.value ||
     this.props.usrType === Enum_userType.Head.value)){
    return true;
  }
  else
    return false;
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light target-active">
          <a className="navbar-brand" href='/'>
            VGS 
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">              
           
            {this.props.usrId!==null?
              <li className="nav-item">
                <a className="nav-link" style={fontStyle} href="/AppForm">
                Application Form
                </a>
              </li>:null}
            
              {this.props.usrId!==null?
              <li className="nav-item">
                <a className="nav-link" style={fontStyle} href="/Vote">
                Create Vote
                </a>
              </li>:null}
          
            {this.props.usrId===null?
              <li className="nav-item">
              <a className="nav-link" style={fontStyle} href="/Registration">
              Registration
                </a>
              </li>:null}

              {this.props.usrId!==null?
              <li className="nav-item">
              <a className="nav-link" style={fontStyle} href="/SubmitVote">
              Give your Vote
                </a>
              </li>
              :null}
            
            {this.isAllowedUserType()===true? 
              <li>
              <a className="nav-link" style={fontStyle} href="/viewApplications">
              View Applications
                </a>
              </li> : null}
      
              <li className="nav-item" style={{fontSize:"15px",color:"#0FB91B"}}>
                {this.props.vgsUsrId!==null?this.getAppStatusValue(this.props.appStatus):""}
              </li> 

              {this.props.usrId===null?
              <li className="nav-item">
                <a className="btn btn-success nav-link" style={{color:"white",fontSize:"15px"}} href="/Login">
                Sign In
                </a>
              </li>:null}

            { this.props.usrId!==null?
              <li className="nav-item">
              <a className="nav-link" href="/">
              <Logout />
                </a>
              </li>:null }
     
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

const fontStyle={
  fontSize:"15px"
}

const mapStateToProps = (state)=>{
  return {
    usrId:state.userId,
    vgsUsrId:state.VGSUserId,
    usrType: state.userType,
   appStatus: state.appStatus
  }
}
export default connect(mapStateToProps)(Navbar)
